import json

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

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


@auth_bp.post("/google")
def google_login():
    """Verify a Google Identity Services ID token and sign the user in,
    creating an account on first sign-in. No password is ever set for
    Google-only accounts (see User.password_hash / auth_provider)."""
    data = request.get_json(silent=True) or {}
    credential = data.get("credential")
    if not credential:
        return jsonify(error="Missing Google credential"), 422
    if not current_app.config["GOOGLE_CLIENT_ID"]:
        return jsonify(error="Google sign-in isn't configured on this server"), 500

    try:
        claims = google_id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            current_app.config["GOOGLE_CLIENT_ID"],
        )
    except ValueError:
        return jsonify(error="Invalid or expired Google credential"), 401

    email = (claims.get("email") or "").lower()
    if not email or not claims.get("email_verified"):
        return jsonify(error="Google account email is not verified"), 401

    user = User.query.filter_by(email=email).first()
    if user is None:
        user = User(
            email=email,
            name=claims.get("name"),
            auth_provider="google",
            google_sub=claims.get("sub"),
        )
        db.session.add(user)
        db.session.commit()
    elif not user.google_sub:
        user.google_sub = claims.get("sub")
        db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify(token=token, user=user.to_dict())


@auth_bp.get("/me")
@jwt_required()
def me():
    user = User.query.get_or_404(int(get_jwt_identity()))
    return jsonify(user=user.to_dict())


# Keeps the users table reasonable — avatars are small resized JPEGs/PNGs
# encoded client-side before upload, not arbitrary user photos.
MAX_AVATAR_BYTES = 300_000


@auth_bp.patch("/me")
@jwt_required()
def update_me():
    user = User.query.get_or_404(int(get_jwt_identity()))
    data = request.get_json(silent=True) or {}

    if "name" in data:
        name = (data.get("name") or "").strip()
        user.name = name or None

    if "avatar" in data:
        avatar = data.get("avatar")
        if avatar is None:
            user.avatar = None
        else:
            if not isinstance(avatar, str) or not avatar.startswith("data:image/"):
                return jsonify(error="Avatar must be an image data URI"), 422
            if len(avatar.encode("utf-8")) > MAX_AVATAR_BYTES:
                return jsonify(error="Avatar image is too large"), 422
            user.avatar = avatar

    if "use_cases" in data:
        use_cases = data.get("use_cases")
        if not isinstance(use_cases, list) or not all(isinstance(item, str) for item in use_cases):
            return jsonify(error="Use cases must be a list of choices"), 422
        user.use_cases = json.dumps(use_cases[:4])

    db.session.commit()
    return jsonify(user=user.to_dict())


@auth_bp.delete("/me")
@jwt_required()
def delete_me():
    user = User.query.get_or_404(int(get_jwt_identity()))
    db.session.delete(user)
    db.session.commit()
    return "", 204
