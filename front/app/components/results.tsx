import { Point, Result } from '../models/points';
import Map from './map';
import { Box, MapPin } from 'lucide-react';

type Props = {
    points: Point[];
    result: Result | null;
};

export default function Results({ points, result }: Props) {
    return (
        < div className="bg-white rounded-2xl shadow-xl p-6" >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Box size={24} className="text-indigo-600" />
                Results
            </h2>

            {
                result ? (
                    <div>
                        {/* Map View */}
                        <Map points={points} result={result} />

                        {/* Textual Results */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Centroid Card */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="text-green-600" size={18} />
                                    <span className="font-medium text-gray-800">Centroid</span>
                                </div>
                                <div className="text-sm text-gray-700 space-y-1 font-mono">
                                    <div>Lat: {result.centroid.lat.toFixed(4)}</div>
                                    <div>Lng: {result.centroid.lng.toFixed(4)}</div>
                                </div>
                            </div>

                            {/* Bounds Card */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-3 border-2 border-blue-500 border-dashed"></div>
                                    <span className="font-medium text-gray-800">Bounds</span>
                                </div>
                                <div className="text-sm text-gray-700 grid grid-cols-2 gap-x-6 gap-y-1 font-mono">
                                    <div>North: {result.bounds.north.toFixed(4)}</div>
                                    <div>South: {result.bounds.south.toFixed(4)}</div>
                                    <div>East: {result.bounds.east.toFixed(4)}</div>
                                    <div>West: {result.bounds.west.toFixed(4)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <MapPin size={64} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Add points and click Calculate to see results</p>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
