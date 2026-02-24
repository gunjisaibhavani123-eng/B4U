from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.nudge import NudgeCheckRequest, NudgeCheckResponse
from app.services import nudge_service

router = APIRouter(prefix="/nudge", tags=["nudge"])


@router.post("/check", response_model=NudgeCheckResponse)
def check_nudge(
    data: NudgeCheckRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return nudge_service.evaluate_spend(db, user.id, data.amount, data.category)
