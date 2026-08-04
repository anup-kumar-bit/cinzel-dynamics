// Receives the contact popup's submissions and forwards them on.
//
// Where they go is set by CONTACT_WEBHOOK_URL — a Slack/Teams incoming webhook,
// a Zapier catch hook, or the backend once it has an endpoint. With nothing
// configured this answers 501 rather than pretending to have delivered a lead,
// and the popup falls back to showing the email address.

const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const looksLikePhone = (value) => value.replace(/[^\d]/g, "").length >= 7;

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  // Any bot that filled the hidden field gets a 200 and no delivery, so it has
  // nothing to learn from the response.
  if (body.company) {
    return Response.json({ ok: true });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  const requirement = String(body.requirement ?? "").trim().slice(0, 4000);
  const page = String(body.page ?? "").trim().slice(0, 200);
  const mode = body.mode === "full" ? "full" : "quick";

  if (!looksLikeEmail(email) && !looksLikePhone(phone)) {
    return Response.json({ error: "no-contact-method" }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    console.error("[contact] CONTACT_WEBHOOK_URL is not set — lead was not delivered:", {
      mode,
      email,
      phone,
    });
    return Response.json({ error: "not-configured" }, { status: 501 });
  }

  const lines = [
    `New ${mode === "full" ? "brief" : "callback request"} from the site`,
    name && `Name: ${name}`,
    email && `Email: ${email}`,
    phone && `Phone: ${phone}`,
    requirement && `Needs: ${requirement}`,
    page && `Page: ${page}`,
  ].filter(Boolean);

  try {
    const delivered = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: lines.join("\n"),
        lead: { mode, name, email, phone, requirement, page, receivedAt: new Date().toISOString() },
      }),
    });

    if (!delivered.ok) {
      console.error("[contact] webhook rejected the lead:", delivered.status);
      return Response.json({ error: "upstream" }, { status: 502 });
    }
  } catch (cause) {
    console.error("[contact] webhook unreachable:", cause);
    return Response.json({ error: "upstream" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
