from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import SessionLocal, engine
from app.models.base import Base

# Import all models so Base.metadata knows about them
from app.models import budget, challenge, chat, checklist, expense, goal, user  # noqa: F401
from app.routers import auth, budgets, challenges, chat as chat_router, checklist as checklist_router, dashboard, expenses, goals, nudge, users
from app.utils.seed_challenges import seed_challenges


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_challenges(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="B4USpend API",
    version="1.0.0",
    description="Personal finance management API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")
app.include_router(budgets.router, prefix="/api/v1")
app.include_router(goals.router, prefix="/api/v1")
app.include_router(checklist_router.router, prefix="/api/v1")
app.include_router(nudge.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(challenges.router, prefix="/api/v1")
app.include_router(chat_router.router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "healthy"}
