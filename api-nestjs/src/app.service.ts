import { Injectable } from '@nestjs/common';

import fetch from 'node-fetch';

const pointsCache = new Map<string, any>();

@Injectable()
export class AppService {
    /**
     * Sends a POST request to the /api/points endpoint with an array of latitude and longitude points.
     * Utilizes a cache to avoid redundant network requests for identical input.
     * Logs request duration and cache usage for debugging purposes.
     *
     * @param body - An object containing an array of points, each with 'lat' and 'lng' properties.
     * @returns A promise resolving to the API response data.
     */
    async callApiWithPoints(body: { points: { lat: number; lng: number; }[] }): Promise<any> {
        const url = 'http://localhost:8000/api/points';
        const cacheKey = JSON.stringify(body);
        if (pointsCache.has(cacheKey)) {
            console.log('Returning cached response for points');
            return pointsCache.get(cacheKey);
        }
        const start = Date.now();
        let response: fetch.Response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
        } catch (error) {
            const duration = Date.now() - start;
            console.error(`Request to ${url} failed after ${duration}ms:`, error);
            return { error: 'Geo-Processor API is not reachable', details: error instanceof Error ? error.message : error };
        }
        const duration = Date.now() - start;
        if (response.status == 200) {
            console.log(`Request to ${url} succeed in ${duration}ms`);
            const data = await response.json();
            pointsCache.set(cacheKey, data);
            return data;
        } else {
            console.warn(`Request to ${url} failed with status ${response.status}`);
            return response.json();
        }
    }
}
