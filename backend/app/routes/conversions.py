import os
from uuid import uuid4

import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import SavedConversion

conversions_bp = Blueprint("conversions", __name__)

REQUIRED_FIELDS = ["from_currency", "to_currency", "amount", "rate", "converted_value"]
WISE_COMPARISON_URL = os.environ.get("WISE_COMPARISON_URL", "https://api.wise.com/v4/comparisons")
OPEN_ER_URL = os.environ.get("OPEN_ER_URL", "https://open.er-api.com/v6/latest")
SUPPORTED_CHANNELS = {"Remitly", "Wise", "Bank", "M-Pesa", "Cash pickup"}


def _current_user_id():
    return int(get_jwt_identity())


def _wise_headers():
    headers = {"Accept": "application/json", "X-External-Correlation-Id": str(uuid4())}
    token = os.environ.get("WISE_API_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def _as_float(value):
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _get_mid_market_rate(source_currency, target_currency):
    if source_currency == target_currency:
        return 1.0

    response = requests.get(f"{OPEN_ER_URL}/{source_currency}", timeout=10)
    response.raise_for_status()
    data = response.json()
    rate = data.get("rates", {}).get(target_currency)
    if rate is None:
        raise LookupError(f"No reference rate available for {source_currency}/{target_currency}.")
    return float(rate)


def _request_wise_comparison(source_currency, target_currency, amount, mid_market_rate):
    """Call Wise v4 Comparison API using the same mid-market benchmark as PesaRate."""
    params = {
        "sourceCurrency": source_currency,
        "targetCurrency": target_currency,
        "sendAmount": amount,
        "midMarketRate": mid_market_rate,
        "includeWise": "true",
    }

    response = requests.get(
        WISE_COMPARISON_URL,
        params=params,
        headers=_wise_headers(),
        timeout=15,
    )

    if response.status_code == 429:
        raise RuntimeError("The provider comparison service is temporarily rate limited. Please try again shortly.")

    if not response.ok:
        try:
            details = response.json()
        except ValueError:
            details = response.text[:500]
        raise RuntimeError(f"Wise comparison request failed ({response.status_code}): {details}")

    data = response.json()


    if not isinstance(data, dict):
        raise RuntimeError("Wise returned an invalid comparison response.")
    return data


def _provider_matches_channel(provider, channel):
    alias = str(provider.get("alias", "")).strip().lower()
    name = str(provider.get("name", "")).strip().lower()
    provider_type = str(provider.get("type", "")).strip().lower()

    if channel == "Wise":
        return alias == "wise" or name == "wise"
    if channel == "Remitly":
        return alias == "remitly" or name == "remitly"
    if channel == "Bank":
        return provider_type == "bank"
    return False


def _select_provider_quote(data, channel):
    """Select the best usable quote for the selected PesaRate channel.

    Wise may return multiple quotes for a provider because pricing can vary by
    route dimensions such as source/target country and delivery speed. Since
    PesaRate currently does not collect destination country, generic quotes
    are preferred; among otherwise equivalent quotes, the highest recipient
    amount is used.
    """
    providers = data.get("providers") or []
    matching = [p for p in providers if _provider_matches_channel(p, channel)]
    if not matching:
        raise LookupError(f"No {channel} provider comparison is available for this route.")

    candidates = []
    for provider in matching:
        for quote in provider.get("quotes") or []:
            received = _as_float(quote.get("receivedAmount"))
            if received is None:
                continue
            candidates.append({
                "provider_id": provider.get("id"),
                "provider_alias": provider.get("alias"),
                "provider_name": provider.get("name") or channel,
                "provider_type": provider.get("type"),
                "rate": _as_float(quote.get("rate")),
                "fee": _as_float(quote.get("fee")) or 0.0,
                "markup": _as_float(quote.get("markup")),
                "received_amount": received,
                "date_collected": quote.get("dateCollected"),
                "delivery_estimation": quote.get("deliveryEstimation"),
                "source_country": quote.get("sourceCountry"),
                "target_country": quote.get("targetCountry"),
                "is_mid_market": bool(quote.get("isConsideredMidMarketRate", False)),
            })

    if not candidates:
        raise LookupError(f"No usable {channel} quote was returned for this route.")

    candidates.sort(
        key=lambda item: (
            item["source_country"] is None and item["target_country"] is None,
            item["received_amount"],
        ),
        reverse=True,
    )
    return candidates[0]


def _build_comparison(source_currency, target_currency, amount, channel):
    """Build a provider comparison using live market and provider quote data."""
    source_currency = source_currency.upper()
    target_currency = target_currency.upper()

    if channel not in SUPPORTED_CHANNELS:
        raise ValueError(f"Unsupported channel: {channel}")

    if channel == "Cash pickup":
        raise ValueError("Cash pickup comparison is not currently supported.")

    if amount <= 0:
        raise ValueError("Amount must be greater than zero.")

    mid_market_rate = _get_mid_market_rate(
        source_currency,
        target_currency,
    )

    mid_market_result = amount * mid_market_rate

    comparison_data = _request_wise_comparison(
        source_currency,
        target_currency,
        amount,
        mid_market_rate,
    )

    quote = _select_provider_quote(comparison_data, channel)

    provider_rate = quote.get("rate")
    if provider_rate is None:
        raise LookupError(f"No usable {channel} provider rate was returned for this route.")

    provider_result = quote["received_amount"]

    fee = quote["fee"]
    difference = mid_market_result - provider_result
    cost_percent = (
        difference / mid_market_result * 100
        if mid_market_result
        else 0.0
    )

    fee_percent = (
        fee / amount * 100
        if amount
        else 0.0
    )

    return {
        "sourceCurrency": source_currency,
        "targetCurrency": target_currency,
        "amount": amount,
        "channel": channel,

        "midMarketRate": mid_market_rate,
        "midMarketResult": mid_market_result,

        "provider": {
            "id": quote["provider_id"],
            "alias": quote["provider_alias"],
            "name": quote["provider_name"],
            "type": quote["provider_type"],
        },

        "providerRate": provider_rate,
        "fee": fee,
        "feeCurrency": source_currency,
        "feePercent": fee_percent,
        "markupPercent": quote.get("markup"),

        "amountAfterFee": amount - fee,
        "providerResult": provider_result,

        "difference": difference,
        "costPercent": cost_percent,

        "dateCollected": quote.get("date_collected"),
        "deliveryEstimation": quote.get("delivery_estimation"),
        "sourceCountry": quote.get("source_country"),
        "targetCountry": quote.get("target_country"),
        "isMidMarket": quote.get("is_mid_market", False),

        "isMockPricing": False,
        "comparisonDisclaimer": (
            "Provider pricing is based on the available comparison quote. "
            "Exchange rates and provider pricing may change."
        ),
    }


@conversions_bp.get("/compare")
def compare_conversion():
    """Public read-only provider comparison endpoint."""
    source_currency = request.args.get("from_currency", "").strip().upper()
    target_currency = request.args.get("to_currency", "").strip().upper()
    channel = request.args.get("channel", "Wise").strip()
    amount = request.args.get("amount", type=float)

    if len(source_currency) != 3:
        return jsonify(error="Invalid source currency."), 422
    if len(target_currency) != 3:
        return jsonify(error="Invalid target currency."), 422
    if amount is None or amount <= 0:
        return jsonify(error="Amount must be greater than zero."), 422
    if channel not in SUPPORTED_CHANNELS:
        return jsonify(error=f"Unsupported channel: {channel}"), 422

    try:
        return jsonify(comparison=_build_comparison(source_currency, target_currency, amount, channel))
    except ValueError as exc:
        return jsonify(error=str(exc)), 422
    except LookupError as exc:
        return jsonify(error=str(exc), code="NO_COMPARISON"), 404
    except RuntimeError as exc:
        return jsonify(error=str(exc), code="COMPARISON_SERVICE_ERROR"), 502
    except requests.RequestException:
        return jsonify(
            error="Unable to reach the exchange-rate or comparison service.",
            code="UPSTREAM_UNAVAILABLE",
        ), 502


@conversions_bp.get("")
@jwt_required()
def list_conversions():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)
    query = (
        SavedConversion.query.filter_by(user_id=_current_user_id())
        .order_by(SavedConversion.created_at.desc())
    )
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify(
        conversions=[c.to_dict() for c in pagination.items],
        page=pagination.page,
        per_page=pagination.per_page,
        total=pagination.total,
        pages=pagination.pages,
    )


@conversions_bp.post("")
@jwt_required()
def create_conversion():
    data = request.get_json(silent=True) or {}
    missing = [f for f in REQUIRED_FIELDS if data.get(f) in (None, "")]
    if missing:
        return jsonify(error=f"Missing required field(s): {', '.join(missing)}"), 422

    conversion = SavedConversion(
        user_id=_current_user_id(),
        from_currency=str(data["from_currency"]).upper()[:3],
        to_currency=str(data["to_currency"]).upper()[:3],
        amount=float(data["amount"]),
        rate=float(data["rate"]),
        converted_value=float(data["converted_value"]),
        channel=(str(data["channel"]).strip()[:40] if data.get("channel") else None),
    )
    db.session.add(conversion)
    db.session.commit()
    return jsonify(conversion=conversion.to_dict()), 201


def _get_owned_conversion_or_404(conversion_id):
    conversion = SavedConversion.query.get_or_404(conversion_id)
    if conversion.user_id != _current_user_id():
        return None
    return conversion


@conversions_bp.patch("/<int:conversion_id>")
@jwt_required()
def update_conversion(conversion_id):
    conversion = _get_owned_conversion_or_404(conversion_id)
    if conversion is None:
        return jsonify(error="Not found"), 404
    data = request.get_json(silent=True) or {}
    for field in ["from_currency", "to_currency"]:
        if field in data:
            setattr(conversion, field, str(data[field]).upper()[:3])
    if "channel" in data:
        conversion.channel = str(data["channel"]).strip()[:40] if data["channel"] else None
    for field in ["amount", "rate", "converted_value"]:
        if field in data:
            setattr(conversion, field, float(data[field]))
    db.session.commit()
    return jsonify(conversion=conversion.to_dict())


@conversions_bp.delete("/<int:conversion_id>")
@jwt_required()
def delete_conversion(conversion_id):
    conversion = _get_owned_conversion_or_404(conversion_id)
    if conversion is None:
        return jsonify(error="Not found"), 404
    db.session.delete(conversion)
    db.session.commit()
    return "", 204
