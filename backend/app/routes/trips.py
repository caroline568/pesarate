from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import Trip

trips_bp = Blueprint("trips", __name__)

REQUIRED_FIELDS = [
    "destination",
    "travel_date",
    "days",
    "budget_kes",
    "target_currency",
    "rate",
    "converted_amount",
]


def _current_user_id():
    return int(get_jwt_identity())


def _parse_date(value):
    return datetime.strptime(value, "%Y-%m-%d").date()


def _get_owned_trip_or_none(trip_id):
    trip = Trip.query.get_or_404(trip_id)
    return trip if trip.user_id == _current_user_id() else None


@trips_bp.get("")
@jwt_required()
def list_trips():
    trips = (
        Trip.query.filter_by(user_id=_current_user_id())
        .order_by(Trip.travel_date.asc())
        .all()
    )
    return jsonify(trips=[t.to_dict() for t in trips])


@trips_bp.post("")
@jwt_required()
def create_trip():
    data = request.get_json(silent=True) or {}
    missing = [f for f in REQUIRED_FIELDS if data.get(f) in (None, "")]
    if missing:
        return jsonify(error=f"Missing required field(s): {', '.join(missing)}"), 422

    try:
        travel_date = _parse_date(str(data["travel_date"]))
    except ValueError:
        return jsonify(error="travel_date must be in YYYY-MM-DD format"), 422

    trip = Trip(
        user_id=_current_user_id(),
        destination=str(data["destination"]).strip()[:120],
        travel_date=travel_date,
        days=int(data["days"]),
        budget_kes=float(data["budget_kes"]),
        target_currency=str(data["target_currency"]).upper()[:3],
        channel=(str(data["channel"]).strip()[:40] if data.get("channel") else None),
        country_code=(str(data["country_code"]).strip().upper()[:2] if data.get("country_code") else None),
        budget_breakdown=data.get("budget_breakdown") or {},
        currency_recommendation=(
            str(data["currency_recommendation"]).strip().upper()[:3]
            if data.get("currency_recommendation")
            else None
        ),
        channel_recommendation=(
            str(data["channel_recommendation"]).strip()[:40]
            if data.get("channel_recommendation")
            else None
        ),
        rate=float(data["rate"]),
        converted_amount=float(data["converted_amount"]),
    )
    db.session.add(trip)
    db.session.commit()
    return jsonify(trip=trip.to_dict()), 201


@trips_bp.patch("/<int:trip_id>")
@jwt_required()
def update_trip(trip_id):
    trip = _get_owned_trip_or_none(trip_id)
    if trip is None:
        return jsonify(error="Not found"), 404

    data = request.get_json(silent=True) or {}

    if "destination" in data:
        trip.destination = str(data["destination"]).strip()[:120]
    if "travel_date" in data:
        try:
            trip.travel_date = _parse_date(str(data["travel_date"]))
        except ValueError:
            return jsonify(error="travel_date must be in YYYY-MM-DD format"), 422
    if "days" in data:
        trip.days = int(data["days"])
    if "budget_kes" in data:
        trip.budget_kes = float(data["budget_kes"])
    if "target_currency" in data:
        trip.target_currency = str(data["target_currency"]).upper()[:3]
    if "channel" in data:
        trip.channel = str(data["channel"]).strip()[:40] if data["channel"] else None
    if "country_code" in data:
        trip.country_code = (
            str(data["country_code"]).strip().upper()[:2]
            if data["country_code"]
            else None
        )
    if "budget_breakdown" in data:
        trip.budget_breakdown = data["budget_breakdown"] or {}
    if "currency_recommendation" in data:
        trip.currency_recommendation = (
            str(data["currency_recommendation"]).strip().upper()[:3]
            if data["currency_recommendation"]
            else None
        )
    if "channel_recommendation" in data:
        trip.channel_recommendation = (
            str(data["channel_recommendation"]).strip()[:40]
            if data["channel_recommendation"]
            else None
        )
    if "rate" in data:
        trip.rate = float(data["rate"])
    if "converted_amount" in data:
        trip.converted_amount = float(data["converted_amount"])

    db.session.commit()
    return jsonify(trip=trip.to_dict())


@trips_bp.delete("/<int:trip_id>")
@jwt_required()
def delete_trip(trip_id):
    trip = _get_owned_trip_or_none(trip_id)
    if trip is None:
        return jsonify(error="Not found"), 404
    db.session.delete(trip)
    db.session.commit()
    return "", 204
