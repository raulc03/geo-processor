# Geographic Processing Platform

This repository contains a modular platform for geographic data analysis and visualization. It includes three main components:
- A backend Python service (FastAPI) for geographic calculations.
- An API gateway and cache service (NestJS/Node.js).
- A Next.js frontend client for user interaction and visualization.

## Table of Contents

- [Installation (Global)](#installation-global)
- [Service: Geographic Processing API (Python/FastAPI)](#service-geographic-processing-api-pythonfastapi)
  - [Description](#description)
  - [Main Features](#main-features)
  - [Main Endpoint](#main-endpoint)
  - [Example request](#example-request)
  - [Example response](#example-response)
  - [Running](#running)
  - [Technical decisions](#technical-decisions)
  - [Function signatures exposed by the API](#function-signatures-exposed-by-the-api)
- [Service: API Gateway & Caching (NestJS)](#service-api-gateway--caching-nestjs)
  - [Description](#description-1)
  - [Main Features](#main-features-1)
  - [Main Endpoint](#main-endpoint-1)
  - [Example request](#example-request-1)
  - [Example response](#example-response-1)
  - [Running](#running-1)
  - [Technical decisions](#technical-decisions-1)
  - [Function signatures exposed by the API](#function-signatures-exposed-by-the-api-1)
- [Service: Frontend Web Client (Next.js)](#service-frontend-web-client-nextjs)
  - [Description](#description-2)
  - [Main Features](#main-features-2)
  - [Main Screen](#main-screen)
  - [Running](#running-2)
  - [Technical decisions](#technical-decisions-2)

## Installation (Global)

**Prerequisites:**
- Python 3.8+
- Node.js 18+
- npm
- [uv](https://github.com/astral-sh/uv): Install with `pip install uv`
- GNU Make

Install all dependencies (run in the root directory):

```bash
make install
```

To start **all** services at once:

```bash
make run
```

---

## Service: Geographic Processing API (Python/FastAPI)

### Description

Python backend service built with FastAPI. It provides an endpoint to calculate the centroid and bounding box of a set of geographic coordinates (latitude and longitude).

### Main Features

- Receives a list of points (coordinates).
- Calculates the centroid of the points.
- Calculates the minimal bounding box containing all points.
- Responds with both values.

#### Main Endpoint

- **POST `/api/points`**
  - **Description:** Processes a list of points and returns centroid and bounds.
  - **Input:** JSON with the field `points`, each point having `{ lat: float, lng: float }`.
  - **Output:** An object with two fields:
    - `centroid`: `{ lat, lng }` (centroid)
    - `bounds`: `{ north, south, east, west }` (bounding box)

#### Example request:
```json
POST /api/points

{
  "points": [
    {"lat": 10.0, "lng": 20.0},
    {"lat": 12.0, "lng": 21.0}
  ]
}
```

#### Example response:
```json
{
  "centroid": {"lat": 11.0, "lng": 20.5},
  "bounds":   {"north": 12.0, "south": 10.0, "east": 21.0, "west": 20.0}
}
```

---

### Running

In a separate terminal, from the `api-python` directory:

```bash
make run
```

To run the tests:
```bash
make test
```

---

### Technical decisions

-
-

---

### Function signatures exposed by the API

- **POST `/api/points`**
  - **Input:**
    - `points`: List of points, each with `lat` (float) and `lng` (float).
  - **Output:**
    - `centroid`: Object `{ lat: float, lng: float }`
    - `bounds`: Object `{ north: float, south: float, east: float, west: float }`
  - **Errors:**
    - 400 Bad Request if required fields are missing.

- **validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse**
  - **Description:** Handles FastAPI input validation errors and transforms them into a standardized error response. Returns HTTP 400 when the request does not contain required latitude or longitude fields.
  - **Inputs:**
    - `request` (Request): The incoming HTTP request (unused within the handler).
    - `exc` (RequestValidationError): The exception containing validation errors.
  - **Returns:**
    - `JSONResponse` object with 400 status code and error detail list.

---

## Service: API Gateway & Caching (NestJS)

### Description

This service acts as an intermediary API gateway between the frontend (Next.js client) and the backend geo-processor service (Python/FastAPI). It is responsible for:

- Forwarding coordinate-processing requests from clients to the Python API.
- Caching identical requests to reduce redundant calls and improve efficiency.
- Validating input with strong typing and request validation.

### Main Features

- Accepts a list of geographic coordinates via POST `/points`.
- Forwards the points to the Python API and returns the centroid and bounding box response.
- Caches identical requests in memory.
- Handles and relays backend errors clearly.
- Performs input validation with `class-validator`.

#### Main Endpoint

- **POST `/points`**
  - **Description:** Receives a JSON body with an array of points, validates the data, forwards it to the Python API, and returns the corresponding result (centroid and bounds).
  - **Input:** JSON object:
    - `points`: Array of objects, each with `{ lat: number; lng: number }`
  - **Output:** Object:
    - `centroid`: `{ lat: number, lng: number }`
    - `bounds`: `{ north: number, south: number, east: number, west: number }`
  - **Errors:**
    - 400 Bad Request for invalid input.
    - 503 Service Unavailable if the Python API is unreachable.

#### Example request:
```json
POST /points

{
  "points": [
    { "lat": 10.0, "lng": 20.0 },
    { "lat": 12.0, "lng": 21.0 }
  ]
}
```

#### Example response:
```json
{
  "centroid": { "lat": 11.0, "lng": 20.5 },
  "bounds":   { "north": 12.0, "south": 10.0, "east": 21.0, "west": 20.0 }
}
```

---

### Running

In a separate terminal, from the `api-nestjs` directory:

```bash
make run
```

To run tests:
```bash
make test
```

---

### Technical decisions

-
-

---

### Function signatures exposed by the API

- **POST `/points`**
  - **Input:** `body: { points: { lat: number; lng: number }[] }`
  - **Output:** 
    - `centroid` (object): `{ lat: number, lng: number }`
    - `bounds` (object): `{ north: number, south: number, east: number, west: number }`
  - **Errors:** 
    - Returns 400 if input is missing or invalid.
    - Returns 503 if underlying geo-processor API is unavailable.

- **callApiWithPoints(body: { points: { lat: number; lng: number }[] }): Promise<any>**
  - **Description:** Forwards a list of points to the Python geo-processor service, caches repeated requests, and returns the result or error.
  - **Input:** An object: `{ points: Array<{ lat: number; lng: number }> }`
  - **Returns:** Response from the Python API as described above, or error info if unavailable.

---

## Service: Frontend Web Client (Next.js)

### Description

This is the client-facing web application built using Next.js and React. It allows users to visually input geographic points, view results, and interact with the processing pipeline in real time.

### Main Features

- Intuitive form to input a list of coordinates (latitude and longitude pairs).
- Renders:
  - The input points on a map.
  - The computed centroid and the bounding box (bounds).
- Provides instant visual feedback for user input and results.
- Handles and displays errors coming from the backend services.

#### Main Screen

- UI built with React and TailwindCSS.
- Uses Leaflet-based visualization for the map.
- Interacts with the NestJS API via a POST request with user's coordinates.
- Shows colored legends for input points, centroid, and bounding box.

---

### Running

In a separate terminal, from the `front` directory:

```bash
make run
```

---

### Technical decisions

-
-

---
