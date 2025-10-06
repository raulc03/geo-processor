# This file defines Pydantic models for error responses:
# - ErrorDetail: Represents a single error with location, message, and type.
# - ErrorResponse: Contains a list of ErrorDetail objects as the error details.

from pydantic import BaseModel


class ErrorDetail(BaseModel):
    loc: list
    msg: str
    type: str


class ErrorResponse(BaseModel):
    detail: list[ErrorDetail]
