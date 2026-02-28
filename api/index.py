import sys
import os

# Add server directory to Python path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))

# DATABASE_URL must be set as a Vercel environment variable (e.g. postgresql://...)
# Fallback to ephemeral SQLite only for local testing without env var set
if not os.environ.get('DATABASE_URL'):
    raise RuntimeError("DATABASE_URL environment variable is not set. Set it in Vercel to a PostgreSQL connection string.")

# Import the FastAPI app (this registers all models in Base.metadata)
from main import app as _asgi_app  # noqa: F401

# Run startup manually — a2wsgi does not trigger ASGI lifespan events.
# This creates all tables and seeds challenge data on every cold start.
from app.database import engine, SessionLocal
from app.models.base import Base
from app.utils.seed_challenges import seed_challenges

Base.metadata.create_all(bind=engine)
_db = SessionLocal()
try:
    seed_challenges(_db)
finally:
    _db.close()

# Bridge FastAPI (ASGI) → WSGI so Vercel's Python runtime can call `app`
from a2wsgi import ASGIMiddleware
app = ASGIMiddleware(_asgi_app)
