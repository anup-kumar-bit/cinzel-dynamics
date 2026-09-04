import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// The session cookie is now issued by the FastAPI backend (see
// backend/app/security.py) — this only verifies it, using the same
// JWT_SECRET value set in both frontend/.env.local and backend/.env.
const COOKIE_NAME = "cinzel_session";

export const config = {
  matcher: ["/cinzel-panel/:path*"],
};

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/cinzel-panel/login";
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let authed = false;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      authed = true;
    } catch {
      authed = false;
    }
  }

  if (!authed && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/cinzel-panel/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (authed && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/cinzel-panel";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
