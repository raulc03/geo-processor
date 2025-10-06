from fastapi import APIRouter

from api_python.schemas.errors import ErrorResponse
from api_python.schemas.points import Bounds, Point, Points, PointsResponse


router = APIRouter(prefix="/points", tags=["points"])


@router.post(
    "",
    response_model=PointsResponse,
    responses={400: {"model": ErrorResponse}},
)
def processor(request: Points):
    """
    Processes a collection of points to calculate the bounding box and centroid.

    Args:
        request (Points): An object containing a list of Point objects with latitude and longitude attributes.

    Returns:
        PointsResponse: An object containing the centroid (as a Point) and the bounding box (as Bounds) for the input points.
    """
    latitudes = [point.lat for point in request.points]
    longitudes = [point.lng for point in request.points]

    bounds = Bounds(
        north=round(max(latitudes), 4),
        south=round(min(latitudes), 4),
        east=round(max(longitudes), 4),
        west=round(min(longitudes), 4),
    )

    centroid_lat = round(sum(latitudes) / len(request.points), 4)
    centroid_lng = round(sum(longitudes) / len(request.points), 4)

    return PointsResponse(
        centroid=Point(lat=centroid_lat, lng=centroid_lng), bounds=bounds
    )
