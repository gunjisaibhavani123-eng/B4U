from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.chat import ChatHistoryResponse, ChatMessageResponse, ChatSendRequest
from app.services.chat_service import clear_history, get_history, send_message

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/history", response_model=ChatHistoryResponse)
def get_chat_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    messages = get_history(db, user.id, limit=limit)
    return {"messages": messages}


@router.post("/send", response_model=list[ChatMessageResponse], status_code=201)
def post_send_message(
    body: ChatSendRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    user_msg, bot_msg = send_message(db, user.id, body.content)
    return [user_msg, bot_msg]


@router.delete("/history", status_code=204)
def delete_chat_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    clear_history(db, user.id)
