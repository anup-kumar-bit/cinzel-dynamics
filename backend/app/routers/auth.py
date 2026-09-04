from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import AdminUser
from ..schemas import AdminOut, LoginRequest
from ..security import COOKIE_NAME, create_access_token, get_current_admin, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_MAX_AGE = settings.jwt_expires_minutes * 60


@router.post("/login")
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.email == payload.email).first()
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(str(admin.id))
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=settings.is_production,
        max_age=COOKIE_MAX_AGE,
        path="/",
    )
    return {"ok": True}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"ok": True}


@router.get("/me", response_model=AdminOut)
def me(admin: AdminUser = Depends(get_current_admin)):
    return admin
