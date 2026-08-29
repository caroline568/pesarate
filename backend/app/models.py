from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


def now():
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=now)

    conversions = db.relationship(
        "SavedConversion", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    alerts = db.relationship(
        "RateAlert", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    def set_password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

    def to_dict(self):
        return {"id": self.id, "email": self.email, "name": self.name}


class SavedConversion(db.Model):
    __tablename__ = "saved_conversions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    from_currency = db.Column(db.String(3), nullable=False)
    to_currency = db.Column(db.String(3), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    rate = db.Column(db.Float, nullable=False)
    converted_value = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=now)

    def to_dict(self):
        return {
            "id": self.id,
            "from_currency": self.from_currency,
            "to_currency": self.to_currency,
            "amount": self.amount,
            "rate": self.rate,
            "converted_value": self.converted_value,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class RateAlert(db.Model):
    __tablename__ = "rate_alerts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    from_currency = db.Column(db.String(3), nullable=False)
    to_currency = db.Column(db.String(3), nullable=False)
    target_rate = db.Column(db.Float, nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=now)

    def to_dict(self):
        return {
            "id": self.id,
            "from_currency": self.from_currency,
            "to_currency": self.to_currency,
            "target_rate": self.target_rate,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
