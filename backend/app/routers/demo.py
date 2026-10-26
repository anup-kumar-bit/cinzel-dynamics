from datetime import datetime, timezone

import resend
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import DemoRequest
from ..schemas import DemoRequestIn, DemoRequestList, DemoRequestListItem, DemoRequestOut

router = APIRouter(tags=["demo"])

resend.api_key = settings.resend_api_key

# Clean white professional HTML email for new enquiries.
ENQUIRY_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry — Cinzel Dynamics</title>
</head>

<body style="margin:0;padding:24px 12px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr>
<td align="center">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
       style="max-width:600px;background:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">

  <!-- Header -->
  <tr>
    <td style="padding:24px 30px;background:#ffffff;border-bottom:1px solid #e5e5e5;">

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td>
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.5px;color:#1a1a1a;font-weight:bold;">
              Cinzel Dynamics
            </div>
            <div style="margin-top:4px;font-size:10px;letter-spacing:2px;color:#666666;text-transform:uppercase;">
              Digital Products &amp; Development
            </div>
          </td>
          <td align="right" valign="middle">
            <span style="display:inline-block;padding:4px 10px;background:#f5f5f5;color:#333333;font-size:11px;border-radius:4px;letter-spacing:0.5px;">
              New enquiry
            </span>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- Intro -->
  <tr>
    <td style="padding:24px 30px;">

      <p style="margin:0 0 8px;color:#666666;font-size:11px;letter-spacing:0.5px;text-transform:uppercase;">
        New project inquiry
      </p>

      <h1 style="margin:0 0 10px;color:#1a1a1a;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;line-height:1.4;">
        {name} is interested in a project
      </h1>

      <p style="margin:0 0 0;color:#444444;font-size:14px;line-height:1.6;">
        {name} has contacted Cinzel Dynamics about a potential project.
      </p>

    </td>
  </tr>

  <!-- Client -->
  <tr>
    <td style="padding:0 30px 24px;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;">

      <p style="margin:0 0 12px;color:#666666;font-size:10px;letter-spacing:1.5px;font-weight:bold;text-transform:uppercase;">
        Client details
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
             style="font-size:14px;line-height:1.8;">

        {email_row}
        {phone_row}

      </table>

    </td>
  </tr>

  <!-- Project -->
  <tr>
    <td style="padding:24px 30px;border-top:1px solid #e5e5e5;">

      <p style="margin:0 0 12px;color:#666666;font-size:10px;letter-spacing:1.5px;font-weight:bold;text-transform:uppercase;">
        Project details / requirement
      </p>

      <div style="padding:18px 20px;background:#fafafa;border:1px solid #eaeaea;border-radius:6px;color:#222222;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere;">
        {message}
      </div>

    </td>
  </tr>

  <!-- Actions -->
  <tr>
    <td style="padding:0 30px 24px;">

      <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          {reply_cell}
          {call_cell}
        </tr>
      </table>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:20px 30px;border-top:1px solid #e5e5e5;">

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="color:#666666;font-family:Georgia,'Times New Roman',serif;font-size:13px;">
            Cinzel Dynamics
          </td>
          <td align="right">
            <a href="https://www.cinzeldynamics.com/"
               style="color:#1a1a1a;font-size:11px;text-decoration:none;font-weight:bold;">
              cinzeldynamics.com ↗
            </a>
          </td>
        </tr>
      </table>

    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
"""


def _row(label: str, value: str, mailto: bool = False, tel: bool = False) -> str:
    if not value:
        return ""
    if mailto:
        return (
            f"<tr>"
            f"<td width=\"80\" valign=\"top\" style=\"padding:6px 0;color:#666666;font-size:12px;\">{label}</td>"
            f"<td style=\"padding:6px 0;\">"
            f"<a href=\"mailto:{value}\" style=\"color:#1a1a1a;text-decoration:none;font-weight:bold;\">{value}</a>"
            f"</td>"
            f"</tr>"
        )
    if tel:
        return (
            f"<tr>"
            f"<td width=\"80\" valign=\"top\" style=\"padding:6px 0;color:#666666;font-size:12px;\">{label}</td>"
            f"<td style=\"padding:6px 0;\">"
            f"<a href=\"tel:{value}\" style=\"color:#1a1a1a;text-decoration:none;font-weight:bold;\">{value}</a>"
            f"</td>"
            f"</tr>"
        )
    return (
        f"<tr>"
        f"<td valign=\"top\" style=\"padding:6px 0;color:#666666;font-size:12px;\">{label}</td>"
        f"<td style=\"padding:6px 0;\">{value}</td>"
        f"</tr>"
    )


def _action_cell(label: str, href: str, bg: str, color: str) -> str:
    return (
        f"<td style=\"padding-right:12px;\">"
        f"<a href=\"{href}\""
        f" style=\"display:inline-block;padding:10px 18px;background:{bg};color:{color};"
        f"text-decoration:none;font-size:12px;font-weight:bold;border-radius:4px;\">{label}</a>"
        f"</td>"
    )


@router.post("/book-demo", response_model=DemoRequestOut)
def book_demo(payload: DemoRequestIn, db: Session = Depends(get_db)):
    # Persist so the admin panel can show client, email, time/date, and project requirement.
    record = DemoRequest(
        name=payload.name,
        email=payload.email,
        company=payload.company,
        phone=payload.phone,
        message=payload.message,
    )
    db.add(record)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not save enquiry.")
    db.refresh(record)

    email_row = _row("Email", payload.email, mailto=True) if payload.email else ""
    phone_row = _row("Phone", payload.phone, tel=True) if payload.phone else ""
    reply_cell = _action_cell("Reply to enquiry &rarr;", f"mailto:{payload.email}", "#1a1a1a", "#ffffff") if payload.email else ""
    call_cell = _action_cell("Call client", f"tel:{payload.phone}", "#f5f5f5", "#1a1a1a") if payload.phone else ""

    html = (
        ENQUIRY_HTML.replace("{name}", payload.name)
        .replace("{email_row}", email_row)
        .replace("{phone_row}", phone_row)
        .replace("{message}", payload.message or "No project requirement was provided.")
        .replace("{reply_cell}", reply_cell)
        .replace("{call_cell}", call_cell)
    )

    try:
        resend.Emails.send({
            "from": settings.resend_from,
            "to": [e.strip() for e in settings.demo_notify_to.split(",") if e.strip()],
            "subject": f"New project enquiry from {payload.name}",
            "html": html,
        })
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Email send failed: {exc}")

    return {"ok": True}


@router.get("/demo-requests", response_model=DemoRequestList)
def list_demo_requests(db: Session = Depends(get_db)):
    rows = (
        db.query(DemoRequest)
        .order_by(DemoRequest.created_at.desc())
        .all()
    )
    return {"items": rows}


@router.delete("/demo-requests/{request_id}", status_code=204)
def delete_demo_request(request_id, db: Session = Depends(get_db)):
    row = db.get(DemoRequest, request_id)
    if not row:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    db.delete(row)
    db.commit()
    return None
