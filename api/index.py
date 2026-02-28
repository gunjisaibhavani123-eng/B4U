import sys
import os

# Add server directory to Python path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))

# DATABASE_URL must be set as a Vercel environment variable (e.g. postgresql://...)
if not os.environ.get('DATABASE_URL'):
    raise RuntimeError("DATABASE_URL environment variable is not set. Set it in Vercel to a PostgreSQL connection string.")

# Import the FastAPI app (this registers all models in Base.metadata)
from main import app as _asgi_app  # noqa: F401

# Seed initial challenge data once per cold start.
# Schema is managed by alembic (run `alembic upgrade head` before deploying).
# Wrapped in try/except so a transient DB error doesn't crash the function.
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

# Bridge FastAPI (ASGI) → WSGI so Vercel's Python runtime can call `app`
from a2wsgi import ASGIMiddleware
app = ASGIMiddleware(_asgi_app)
