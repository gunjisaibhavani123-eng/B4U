import sys
import os

# Add server directory to Python path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))

from main import app  # FastAPI ASGI app - Vercel handles ASGI natively
