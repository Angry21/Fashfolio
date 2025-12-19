"use client";

import { useState, useEffect } from "react";
import { getWeatherRecommendations } from "@/lib/actions/weather.actions";

export default function WeatherPill() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [weather, setWeather] = useState<any>(null);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const res = await getWeatherRecommendations(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    setWeather(res.weather);
                } catch (err) {
                    console.error(err);
                }
            },
            (err) => console.error(err)
        );
    }, []);

    if (!weather) return (
        <div className="text-sm font-medium text-gray-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            Loading...
        </div>
    );

    return (
        <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            {weather.temp}°C, {weather.condition}
        </div>
    );
}
