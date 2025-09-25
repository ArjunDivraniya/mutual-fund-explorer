// src/app/api/scheme/[code]/route.js
import { getCache, setCache } from "@/utils/cache";

const API_URL = "https://api.mfapi.in/mf/";

export async function GET(request, { params }) {
  const { code } = await params;

  if (!code) {
    return Response.json({ message: "Scheme code is required" }, { status: 400 });
  }

  const cacheKey = `scheme_${code}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return Response.json(cachedData);
  }

  try {
    const response = await fetch(`${API_URL}${code}`);
    if (!response.ok) {
      if (response.status === 404) {
        return Response.json({ message: "Scheme not found" }, { status: 404 });
      }
      throw new Error("Failed to fetch scheme data");
    }
    const data = await response.json();
    setCache(cacheKey, data, 12 * 60 * 60 * 1000); // Cache for 12 hours
    return Response.json(data);
  } catch (error) {
    return Response.json({
      message: "Error fetching scheme",
      error: error.message,
    }, { status: 500 });
  }
}