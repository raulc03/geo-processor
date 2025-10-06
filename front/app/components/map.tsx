
import dynamic from 'next/dynamic';
import { Bounds, Point, Result } from '../models/points';
import React, { useEffect, useRef, useMemo } from 'react';


type MapProps = {
    points: Point[];
    result: Result;
};

// Dynamically import react-leaflet components
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false, loading: () => <div style={{ height: 256, background: '#f3f4f6' }} /> }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Rectangle = dynamic(
    () => import('react-leaflet').then((mod) => mod.Rectangle),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

function createLeafletIcons() {
    let L: any = null;
    try {
        if (typeof window !== 'undefined') {
            L = require('leaflet');
            // Patch icon URLs (static)
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        }
    } catch { }
    // Centroid icon (green)
    const centroidIcon = L
        ? new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }) : undefined;
    // Point icon (red)
    const pointIcon = L
        ? new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }) : undefined;
    return { centroidIcon, pointIcon };
}

// Overlay Markers for points & centroid
function MarkersOverlay({ points, centroid, pointIcon, centroidIcon }: { points: Point[], centroid: Point, pointIcon: any, centroidIcon: any }) {
    // Render user points
    return <>
        {points.map((point, idx) => (
            <Marker key={idx} position={[point.lat, point.lng]} icon={pointIcon}>
                <Popup>Point {idx + 1}</Popup>
            </Marker>
        ))}
        {/* Centroid marker */}
        <Marker position={[centroid.lat, centroid.lng]} icon={centroidIcon}>
            <Popup>Centroid</Popup>
        </Marker>
    </>;
}

// Overlay the bounds rectangle
function BoundsRectangle({ bounds }: { bounds: Bounds }) {
    return (
        <Rectangle
            bounds={[
                [bounds.south, bounds.west],
                [bounds.north, bounds.east],
            ]}
            pathOptions={{ color: 'blue', fillOpacity: 0.1, dashArray: '10, 10' }}
        />
    );
}

// Map focus updater (imperative refocus only when result changes)
function FocusUpdater({ bounds, centroid }: { bounds: Bounds, centroid: Point }) {
    const { useMap } = require('react-leaflet');
    const map = useMap();
    useEffect(() => {
        if (!bounds || !centroid || !map) return;
        const leafletBounds = [
            [bounds.south, bounds.west],
            [bounds.north, bounds.east],
        ];
        map.fitBounds(leafletBounds, { maxZoom: 10, animate: true });
        map.setView([centroid.lat, centroid.lng]);
    }, [bounds, centroid, map]);
    return null;
}

// Memoized MapContainer - initial render only

let mapIcons = null as { centroidIcon: any, pointIcon: any } | null;

export default function Map({ result, points }: MapProps) {
    // Memoize icons once (per SSR/client session)
    if (!mapIcons) {
        mapIcons = createLeafletIcons();
    }
    const icons = mapIcons;

    const initialCenter = useMemo(() => [result.centroid.lat, result.centroid.lng], []);

    // Always render overlays as children of MapContainer
    return (
        <div className="h-64 rounded-xl overflow-hidden border-2 border-blue-200">
            <MapContainer
                center={initialCenter as [number, number]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <BoundsRectangle bounds={result.bounds} />
                <FocusUpdater bounds={result.bounds} centroid={result.centroid} />
                <MarkersOverlay
                    points={points}
                    centroid={result.centroid}
                    pointIcon={icons.pointIcon}
                    centroidIcon={icons.centroidIcon}
                />
            </MapContainer>
        </div>
    );
}
