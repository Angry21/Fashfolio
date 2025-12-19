"use client";

import { useState, useEffect } from "react";
import { getWeatherRecommendations } from "@/lib/actions/weather.actions";
import OutfitCard from "./OutfitCard";

export default function WeatherWidget() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const res = await getWeatherRecommendations(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    setData(res);
                } catch (err) {
                    console.error(err);
                    setError("Failed to load weather data");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setError("Location permission denied. Enable location to see suggestions.");
                setLoading(false);
            }
        );
    }, []);

    if (loading) return (
        <div className="flex items-center gap-2 text-gray-500 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Checking the forecast...</span>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl mb-8 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
        </div>
    );

    if (!data) return null;

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 border border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span>{data.weather.condition}</span>
                        <span className="text-blue-600">{data.weather.temp}°C</span>
                    </h2>
                    <p className="text-gray-500">Based on your local weather</p>
                </div>
                {data.recommendations.length > 0 && (
                    <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold text-blue-600 shadow-sm border border-blue-100">
                        {data.recommendations.length} items found
                    </span>
                )}
            </div>

            {data.recommendations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {data.recommendations.map((outfit: any) => (
                        <OutfitCard key={outfit._id} outfit={outfit} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 bg-white/50 rounded-lg border border-dashed border-gray-200">
                    <p>No outfits match this weather!</p>
                    <p className="text-sm">Try uploading some {data.weather.temp > 20 ? "summer" : "warm"} clothes.</p>
                </div>
            )}
        </div>
    );
}
