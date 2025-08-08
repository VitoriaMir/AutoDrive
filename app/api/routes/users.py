from fastapi import APIRouter, Depends
from sqlmodel import select
from app.api.deps.auth import get_current_user
from app.db.session import get_session
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_superuser": current_user.is_superuser,
    }

@router.get("")
def list_users(session=Depends(get_session), current_user: User = Depends(get_current_user)):
    # Simple list (restrict to superusers in real projects)
    users = session.exec(select(User)).all()
    return [{"id": u.id, "email": u.email, "full_name": u.full_name} for u in users]