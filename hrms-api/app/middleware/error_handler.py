import os
import traceback
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("error_handler")

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    """
    Middleware to catch all unhandled exceptions and return a 
    consistent JSON response.
    """
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as exc:
            logger.error(f"Unhandled Exception: {str(exc)}")
            logger.error(traceback.format_exc())

            is_dev = os.getenv("ENVIRONMENT") == "development"

            content = {
                "success": False,
                "message": "An unexpected error occurred on the server.",
                "error_type": type(exc).__name__
            }


            if is_dev:
                content["detail"] = str(exc)
                content["trace"] = traceback.format_exc().splitlines()

            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content=content
            )
