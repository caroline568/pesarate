from flask import Flask, jsonify

from config import Config
from .extensions import db, migrate, jwt, cors


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Log configuration on startup (useful for debugging production deployments)
    app.logger.info(f"CORS_ORIGINS: {app.config['CORS_ORIGINS']}")
    app.logger.info(f"DATABASE: {'PostgreSQL' if 'postgresql' in app.config['SQLALCHEMY_DATABASE_URI'] else 'SQLite'}")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=True)

    from . import models  # noqa: F401  (registers models with SQLAlchemy)
    from .routes.auth import auth_bp
    from .routes.conversions import conversions_bp
    from .routes.alerts import alerts_bp
    from .routes.trips import trips_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(conversions_bp, url_prefix="/api/conversions")
    app.register_blueprint(alerts_bp, url_prefix="/api/alerts")
    app.register_blueprint(trips_bp, url_prefix="/api/trips")

    @app.get("/api/health")
    def health():
        return jsonify(status="ok")

    register_error_handlers(app)
    return app


def register_error_handlers(app):
    """Central error handling, per the Project 1 -> Project 2 architecture
    plan: every error path returns the same {"error": "..."} JSON shape."""

    @app.errorhandler(404)
    def not_found(_):
        return jsonify(error="Not found"), 404

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify(error=getattr(e, "description", "Bad request")), 400

    @app.errorhandler(500)
    def internal_error(e):
        app.logger.error(f"Internal server error: {str(e)}", exc_info=True)
        return jsonify(error="Something went wrong on our end. Please try again."), 500

    @app.errorhandler(Exception)
    def handle_exception(e):
        app.logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
        return jsonify(error="Something went wrong on our end. Please try again."), 500

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify(error=getattr(e, "description", "Unprocessable entity")), 422

    @app.errorhandler(500)
    def server_error(_):
        db.session.rollback()
        return jsonify(error="Something went wrong on our end"), 500
