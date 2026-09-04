import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import apps, auth, blog, categories, routes

logger = logging.getLogger("cinzel_api")

ALLOWED_ORIGINS = {origin.strip() for origin in settings.cors_origins.split(",")}

app = FastAPI(title="Cinzel Dynamics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(ALLOWED_ORIGINS),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Catches anything a route doesn't handle itself (a bad Cloudinary key, a DB
# hiccup, a bug) so one broken request returns a clean error instead of a
# raw 500 with no body. The real traceback goes to the server log; nothing
# but "something went wrong" reaches the client. A single request failing
# here never takes the process down — every other request keeps being
# served normally.
#
# Starlette special-cases any handler registered for the bare `Exception`
# class: it's wired into ServerErrorMiddleware, which sits *outside*
# CORSMiddleware, so its response never passes through CORS header
# injection like a normal route's does. Without the headers set here by
# hand, the browser would block the frontend from ever reading this
# response — it'd see a generic "failed to fetch" instead of the message.
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    response = JSONResponse(status_code=500, content={"detail": "Something went wrong. Please try again."})
    origin = request.headers.get("origin")
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Vary"] = "Origin"
    return response


app.include_router(auth.router)
app.include_router(apps.router)
app.include_router(routes.router)
app.include_router(blog.router)
app.include_router(categories.router)


@app.get("/health")
def health():
    return {"status": "ok"}
