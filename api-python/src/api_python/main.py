from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from api_python.routes.points import router as points_router

app = FastAPI(title="Geo Processor")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    """
    Exception handler for request validation errors in FastAPI endpoints.

    This handler customizes error messages for missing latitude and longitude fields in the request body or query parameters.

    Args:
        _: Request
            The incoming HTTP request (unused in this handler).
        exc: RequestValidationError
            The exception instance containing details about the validation error.

    Returns:
        JSONResponse: A response object with HTTP 400 status and details about the validation errors.
    """

    errors = exc.errors()
    points_name_map = {"lat": "latitude", "lng": "longitude"}
    for error in errors:
        if error["type"] == "missing":
            attr = error["loc"][-1]
            if attr in points_name_map:
                attr = points_name_map[attr]
            loc = error["loc"][-2]
            if loc == "body":
                error["msg"] = (
                    f"{loc.capitalize()} does not include the required '{attr}' value"
                )
            else:
                error["msg"] = (
                    f"Point {loc} does not include the required '{attr}' value"
                )

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=jsonable_encoder({"detail": errors}),
    )


app.include_router(router=points_router, prefix="/api")
