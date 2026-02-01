import os
import traceback
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging

# Configure logging
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
            # Log the error with stack trace
            logger.error(f"❌ Unhandled Exception: {str(exc)}")
            logger.error(traceback.format_exc())

            # Determine environment
            is_dev = os.getenv("ENVIRONMENT") == "development"

            # Prepare response content
            content = {
                "success": False,
                "message": "An unexpected error occurred on the server.",
                "error_type": type(exc).__name__
            }

            # Add detailed info in development
            if is_dev:
                content["detail"] = str(exc)
                content["trace"] = traceback.format_exc().splitlines()

            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content=content
            )
