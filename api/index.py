import sys
import os
import traceback

# Add server directory to Python path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))

_startup_error = None

try:
    if not os.environ.get('DATABASE_URL'):
        raise RuntimeError("DATABASE_URL environment variable is not set.")

    from main import app as _asgi_app  # noqa: F401

    try:
        from app.database import SessionLocal
        from app.utils.seed_challenges import seed_challenges
        _db = SessionLocal()
        try:
            seed_challenges(_db)
        finally:
            _db.close()
    except Exception:
        pass

    from a2wsgi import ASGIMiddleware
    app = ASGIMiddleware(_asgi_app)

except Exception:
    _startup_error = traceback.format_exc()

    def app(environ, start_response):
        body = f"Startup error:\n{_startup_error}".encode()
        start_response("500 Internal Server Error", [
            ("Content-Type", "text/plain"),
            ("Content-Length", str(len(body))),
        ])
        return [body]
