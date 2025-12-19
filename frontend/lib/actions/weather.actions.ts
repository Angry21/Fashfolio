"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Outfit from "@/models/Outfit";

// Helper: Translate WMO codes to human-readable conditions
function getWeatherCondition(code: number): string {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy"; // Drizzle & Rain
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Rainy"; // Showers
    if (code >= 85 && code <= 86) return "Snowy"; // Snow showers
    if (code >= 95) return "Stormy"; // Thunderstorm
    return "Unknown";
}

export async function getWeatherRecommendations(lat: number, lon: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Fetch from Open-Meteo (No API Key required)
    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );

    if (!res.ok) throw new Error("Failed to fetch weather");

    const data = await res.json();
    const current = data.current; // Open-Meteo returns a 'current' object

    const temp = Math.round(current.temperature_2m);
    const wmoCode = current.weather_code;
    const condition = getWeatherCondition(wmoCode);

    // 2. Logic: Map Weather to Your Tags
    let targetSeason = "Spring";
    let targetMood = "";

    // Temperature Rules
    if (temp >= 25) targetSeason = "Summer";
    else if (temp <= 15) targetSeason = "Winter";
    else targetSeason = "Fall";

    // Weather Code Rules (Override or set Mood)
    if (condition === "Rainy" || condition === "Stormy") {
        targetMood = "Rainy"; // If you have a 'Rainy' mood tag
        // If it's hot but raining, you might still want Summer clothes, but maybe waterproof ones
    }

    // 3. Query the Database
    await connectToDatabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
        clerkId: userId,
        $or: [
            { season: targetSeason }, // Match the temp-based season
            { 'context.season': targetSeason } // Try both locations just in case
        ]
    };

    // If it's raining, prioritize finding "Rainy" mood OR "Rain" in description
    if (targetMood === "Rainy") {
        query.$or.push({ mood: "Rainy" });
        query.$or.push({ 'context.mood': "Rainy" });
        query.$or.push({ description: { $regex: "rain", $options: "i" } });
    }

    const recommendations = await Outfit.find(query).limit(4);

    return {
        weather: { temp, condition },
        recommendations: JSON.parse(JSON.stringify(recommendations))
    };
}
