from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import SavedConversion

conversions_bp = Blueprint("conversions", __name__)

REQUIRED_FIELDS = ["from_currency", "to_currency", "amount", "rate", "converted_value"]


def _current_user_id():
    return int(get_jwt_identity())


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
    )
    db.session.add(conversion)
    db.session.commit()
    return jsonify(conversion=conversion.to_dict()), 201


def _get_owned_conversion_or_404(conversion_id):
    conversion = SavedConversion.query.get_or_404(conversion_id)
    if conversion.user_id != _current_user_id():
        # 404, not 403 — don't reveal that another user's record exists.
        return None
    return conversion


@conversions_bp.patch("/<int:conversion_id>")
@jwt_required()
def update_conversion(conversion_id):
    conversion = _get_owned_conversion_or_404(conversion_id)
    if conversion is None:
        return jsonify(error="Not found"), 404

    data = request.get_json(silent=True) or {}
    if "from_currency" in data:
        conversion.from_currency = str(data["from_currency"]).upper()[:3]
    if "to_currency" in data:
        conversion.to_currency = str(data["to_currency"]).upper()[:3]
    if "amount" in data:
        conversion.amount = float(data["amount"])
    if "rate" in data:
        conversion.rate = float(data["rate"])
    if "converted_value" in data:
        conversion.converted_value = float(data["converted_value"])

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
