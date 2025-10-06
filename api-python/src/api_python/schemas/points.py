from pydantic import BaseModel, conlist


class Point(BaseModel):
    lat: float
    lng: float


class Points(BaseModel):
    points: conlist(item_type=Point, min_length=1)  # type:ignore


class Bounds(BaseModel):
    north: float
    south: float
    east: float
    west: float


class PointsResponse(BaseModel):
    centroid: Point
    bounds: Bounds
