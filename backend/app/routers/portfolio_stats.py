from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import AdminUser, PortfolioStats
from ..schemas import PortfolioStatsIn, PortfolioStatsOut
from ..security import get_current_admin

router = APIRouter(tags=["portfolio-stats"])


@router.get("/portfolio-stats", response_model=PortfolioStatsOut)
def get_portfolio_stats(db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)):
    return db.query(PortfolioStats).first() or PortfolioStatsOut()


@router.put("/portfolio-stats", response_model=PortfolioStatsOut)
def update_portfolio_stats(
    payload: PortfolioStatsIn, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    stats = db.query(PortfolioStats).first()
    if not stats:
        stats = PortfolioStats()
        db.add(stats)

    stats.needs_fulfilled = payload.needs_fulfilled
    stats.satisfaction = payload.satisfaction
    stats.on_time_delivery = payload.on_time_delivery
    db.commit()
    db.refresh(stats)
    return stats


@router.get("/public/portfolio-stats", response_model=PortfolioStatsOut)
def get_public_portfolio_stats(db: Session = Depends(get_db)):
    return db.query(PortfolioStats).first() or PortfolioStatsOut()
