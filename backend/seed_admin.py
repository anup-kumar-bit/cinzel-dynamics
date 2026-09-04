"""One-off CLI to create (or reset the password of) an admin login.

There's no signup endpoint on purpose — this is a single/few-admin tool, so
accounts are provisioned out-of-band instead of exposing account creation
over HTTP.

Usage:
    python seed_admin.py you@example.com "your-password"
"""

import sys

from app.database import SessionLocal
from app.models import AdminUser
from app.security import hash_password


def main() -> None:
    if len(sys.argv) != 3:
        print('Usage: python seed_admin.py <email> "<password>"')
        raise SystemExit(1)

    email, password = sys.argv[1], sys.argv[2]
    db = SessionLocal()
    try:
        admin = db.query(AdminUser).filter(AdminUser.email == email).first()
        if admin:
            admin.password_hash = hash_password(password)
            print(f"Updated password for {email}")
        else:
            admin = AdminUser(email=email, password_hash=hash_password(password))
            db.add(admin)
            print(f"Created admin {email}")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()
