"use client"

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import { Point, Result } from './models/points';
import InputPoints from './components/input_points';
import Results from './components/results';


const PointsMap: React.FC = () => {
    const [points, setPoints] = useState<Point[]>([
        { lat: 40.7128, lng: -74.0060 },
        { lat: 34.0522, lng: -118.2437 },
    ]);
    const [result, setResult] = useState<Result | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <MapPin className="text-indigo-600" size={40} />
                    Points Bounds & Centroid Calculator
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <InputPoints points={points}
                        setPoints={setPoints}
                        loading={loading}
                        setLoading={setLoading}
                        error={error}
                        setError={setError}
                        setResult={setResult} />
                    <Results points={points} result={result} />
                </div>

                {/* Legend */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                            <span className="text-sm text-gray-700">Input Points</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                            <span className="text-sm text-gray-700">Centroid (Center)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-4 border-2 border-blue-500 border-dashed"></div>
                            <span className="text-sm text-gray-700">Bounding Box</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointsMap;
