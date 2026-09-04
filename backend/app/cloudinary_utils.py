import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool

from .config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)


async def upload_image(file: UploadFile, folder: str) -> tuple[str, str]:
    """The one shared upload path every router calls directly — there is no
    standalone /uploads route. `cloudinary.uploader.upload` is a blocking
    call, so it runs in a thread pool rather than stalling the event loop.
    Returns (secure_url, public_id); public_id is kept so the image can be
    deleted later (on replace or on record delete)."""
    contents = await file.read()
    result = await run_in_threadpool(
        cloudinary.uploader.upload,
        contents,
        folder=f"cinzel-panel/{folder}",
    )
    return result["secure_url"], result["public_id"]


async def delete_image(public_id: str | None) -> None:
    if not public_id:
        return
    await run_in_threadpool(cloudinary.uploader.destroy, public_id)
