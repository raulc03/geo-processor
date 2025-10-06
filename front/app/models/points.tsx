
export type Point = {
    lat: number;
    lng: number;
};

export type Bounds = {
    north: number;
    south: number;
    east: number;
    west: number;
};

export type Result = {
    bounds: Bounds;
    centroid: Point;
};
