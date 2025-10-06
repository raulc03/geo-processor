import { useEffect, useState } from 'react';
import { Point, Result } from '../models/points';
import { Navigation } from 'lucide-react';

type InputPointsProps = {
    points: Point[];
    setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setResult: React.Dispatch<React.SetStateAction<Result | null>>;
};

export default function InputPoints({
    points,
    setPoints,
    loading,
    setLoading,
    error,
    setError,
    setResult,
}: InputPointsProps) {
    const [inputState, setInputState] = useState(() =>
        points.map(pt => ({ lat: pt.lat.toString(), lng: pt.lng.toString() }))
    );

    useEffect(() => {
        setInputState(points.map(pt => ({
            lat: pt.lat.toString(),
            lng: pt.lng.toString(),
        })));
    }, [points]);

    const handleInputChange = (
        idx: number,
        field: 'lat' | 'lng',
        value: string
    ) => {
        const newInputs = inputState.map((pt, i) =>
            i === idx ? { ...pt, [field]: value } : pt
        );
        setInputState(newInputs);

        let num = parseFloat(value);
        if (!Number.isNaN(num)) {
            if (field === 'lat') num = Math.max(-90, Math.min(90, num));
            else num = Math.max(-180, Math.min(180, num));
            num = Math.round(num * 10000) / 10000;
            const newPoints = points.map((pt, i) =>
                i === idx ? { ...pt, [field]: num } : pt
            );
            setPoints(newPoints);
        }
    };

    const commitValue = (
        idx: number,
        field: 'lat' | 'lng'
    ) => {
        let strVal = inputState[idx][field];
        let num = parseFloat(strVal);
        if (Number.isNaN(num)) num = 0;
        if (field === 'lat') num = Math.max(-90, Math.min(90, num));
        else num = Math.max(-180, Math.min(180, num));
        num = Math.round(num * 10000) / 10000;

        const newPoints = points.map((pt, i) =>
            i === idx ? { ...pt, [field]: num } : pt
        );
        setPoints(newPoints);

        setInputState(inputState.map((pt, i) =>
            i === idx ? { ...pt, [field]: num.toString() } : pt
        ));
    };
    const addPoint = () => {
        const roundedLat = Math.round(0 * 10000) / 10000;
        const roundedLng = Math.round(0 * 10000) / 10000;
        setPoints([...points, { lat: roundedLat, lng: roundedLng }]);
        setInputState([...inputState, { lat: roundedLat.toString(), lng: roundedLng.toString() }]);
    };
    const removePoint = (index: number) => {
        if (points.length > 1) {
            setPoints(points.filter((_, i) => i !== index));
            setInputState(inputState.filter((_, i) => i !== index));
        }
    };
    const calculateBoundsAndCentroid = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ points }),
            });

            let data: any = null;
            try {
                data = await response.json();
            } catch (parseErr) {
                // Could not parse; treat as unknown error
            }

            if (!response.ok) {
                const msg =
                    data?.error ||
                    data?.detail?.[0]?.msg ||
                    'An error occurred with your input.';
                setError(msg);
                setResult(null);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError('API is not reachable');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Navigation size={24} className="text-indigo-600" />
                Input Points
            </h2>

            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                <div className="flex gap-2 items-center px-3 pb-1">
                    <span className="w-12"></span>
                    <span className="flex-1 text-xs text-gray-500 font-semibold">Latitude</span>
                    <span className="flex-1 text-xs text-gray-500 font-semibold">Longitude</span>
                    <span className="w-8"></span>
                </div>
                {inputState.map((point, index) => (
                    <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 w-12">#{index + 1}</span>
                        <input
                            type="number"
                            step="0.1000"
                            min="-90"
                            max="90"
                            placeholder="Latitude"
                            value={point.lat}
                            onChange={e => handleInputChange(index, 'lat', e.target.value)}
                            onBlur={() => commitValue(index, 'lat')}
                            onKeyDown={e => {
                                if (e.key === 'Enter') commitValue(index, 'lat');
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-400"
                        />
                        <input
                            type="number"
                            step="0.1000"
                            min="-180"
                            max="180"
                            placeholder="Longitude"
                            value={point.lng}
                            onChange={e => handleInputChange(index, 'lng', e.target.value)}
                            onBlur={() => commitValue(index, 'lng')}
                            onKeyDown={e => {
                                if (e.key === 'Enter') commitValue(index, 'lng');
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg text-gray-900 placeholder-gray-400"
                        />
                        <button
                            onClick={() => removePoint(index)}
                            disabled={points.length === 1}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={addPoint}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                    + Add Point
                </button>
                <button
                    onClick={calculateBoundsAndCentroid}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                    {loading ? 'Calculating...' : 'Calculate'}
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
}
