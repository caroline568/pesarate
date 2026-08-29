from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import RateAlert

alerts_bp = Blueprint("alerts", __name__)

REQUIRED_FIELDS = ["from_currency", "to_currency", "target_rate"]


def _current_user_id():
    return int(get_jwt_identity())


def _get_owned_alert_or_none(alert_id):
    alert = RateAlert.query.get_or_404(alert_id)
    return alert if alert.user_id == _current_user_id() else None


@alerts_bp.get("")
@jwt_required()
def list_alerts():
    alerts = (
        RateAlert.query.filter_by(user_id=_current_user_id())
        .order_by(RateAlert.created_at.desc())
        .all()
    )
    return jsonify(alerts=[a.to_dict() for a in alerts])


@alerts_bp.post("")
@jwt_required()
def create_alert():
    data = request.get_json(silent=True) or {}
    missing = [f for f in REQUIRED_FIELDS if data.get(f) in (None, "")]
    if missing:
        return jsonify(error=f"Missing required field(s): {', '.join(missing)}"), 422

    alert = RateAlert(
        user_id=_current_user_id(),
        from_currency=str(data["from_currency"]).upper()[:3],
        to_currency=str(data["to_currency"]).upper()[:3],
        target_rate=float(data["target_rate"]),
    )
    db.session.add(alert)
    db.session.commit()
    return jsonify(alert=alert.to_dict()), 201


@alerts_bp.patch("/<int:alert_id>")
@jwt_required()
def update_alert(alert_id):
    alert = _get_owned_alert_or_none(alert_id)
    if alert is None:
        return jsonify(error="Not found"), 404

    data = request.get_json(silent=True) or {}
    if "target_rate" in data:
        alert.target_rate = float(data["target_rate"])
    if "active" in data:
        alert.active = bool(data["active"])
    db.session.commit()
    return jsonify(alert=alert.to_dict())


@alerts_bp.delete("/<int:alert_id>")
@jwt_required()
def delete_alert(alert_id):
    alert = _get_owned_alert_or_none(alert_id)
    if alert is None:
        return jsonify(error="Not found"), 404
    db.session.delete(alert)
    db.session.commit()
    return "", 204
