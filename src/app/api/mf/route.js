// src/app/api/mf/route.js
import { getCache, setCache } from "@/utils/cache";

const API_URL = "https://api.mfapi.in/mf";

export async function GET() {
  const cacheKey = "all_schemes";
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return Response.json(cachedData);
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch data from MFAPI");
    }
    const data = await response.json();
    setCache(cacheKey, data, 12 * 60 * 60 * 1000); // Cache for 12 hours
    return Response.json(data);
  } catch (error) {
    return Response.json({
      message: "Error fetching schemes",
      error: error.message,
    }, { status: 500 });
  }
} 