from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from ..extensions import db
from ..models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    name = (data.get("name") or "").strip() or None

    if not email or "@" not in email:
        return jsonify(error="A valid email is required"), 422
    if len(password) < 8:
        return jsonify(error="Password must be at least 8 characters"), 422
    if User.query.filter_by(email=email).first():
        return jsonify(error="An account with that email already exists"), 422

    user = User(email=email, name=name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify(token=token, user=user.to_dict()), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify(error="Incorrect email or password"), 401

    token = create_access_token(identity=str(user.id))
    return jsonify(token=token, user=user.to_dict())


@auth_bp.get("/me")
@jwt_required()
def me():
    user = User.query.get_or_404(int(get_jwt_identity()))
    return jsonify(user=user.to_dict())


@auth_bp.patch("/me")
@jwt_required()
def update_me():
    user = User.query.get_or_404(int(get_jwt_identity()))
    data = request.get_json(silent=True) or {}

    if "name" in data:
        name = (data.get("name") or "").strip()
        user.name = name or None

    if "email" in data:
        email = (data.get("email") or "").strip().lower()
        if not email or "@" not in email:
            return jsonify(error="A valid email is required"), 422
        existing = User.query.filter_by(email=email).first()
        if existing and existing.id != user.id:
            return jsonify(error="An account with that email already exists"), 422
        user.email = email

    if "new_password" in data:
        current_password = data.get("current_password") or ""
        new_password = data.get("new_password") or ""
        if not user.check_password(current_password):
            return jsonify(error="Current password is incorrect"), 401
        if len(new_password) < 8:
            return jsonify(error="Password must be at least 8 characters"), 422
        user.set_password(new_password)

    db.session.commit()
    return jsonify(user=user.to_dict())


@auth_bp.delete("/me")
@jwt_required()
def delete_me():
    user = User.query.get_or_404(int(get_jwt_identity()))
    db.session.delete(user)
    db.session.commit()
    return "", 204
