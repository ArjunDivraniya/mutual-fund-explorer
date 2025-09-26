// src/app/api/scheme/[code]/lumpsum/route.js
import { calculateLumpsum } from "@/utils/calculations";
import { parseMfapiDateString } from "@/utils/date";

export async function GET(request, { params }) {
  
  const code = params.code;
  const { searchParams } = new URL(request.url);
  const amountParam = searchParams.get("amount");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const amount = parseFloat(amountParam ?? "0");
  if (!code || !amount || !from || !to) {
    return Response.json({ message: "code, amount, from, to are required" }, { status: 400 });
  }

  try {
    const resp = await fetch(`https://api.mfapi.in/mf/${code}`);
    if (!resp.ok) {
      if (resp.status === 404) {
        return Response.json({ message: "Scheme not found" }, { status: 404 });
      }
      throw new Error("Failed to fetch scheme data");
    }
    const schemeData = await resp.json();
    if (!schemeData || !schemeData.data) {
      return Response.json({ message: "Scheme not found" }, { status: 404 });
    }

    const navData = schemeData.data
      .map((d) => ({ date: parseMfapiDateString(d.date), nav: parseFloat(d.nav) }))
      .filter((d) => Number.isFinite(d.nav) && !Number.isNaN(d.date.getTime()));

    // FIX 2: Validate input dates and create Date objects
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate.getTime() >= toDate.getTime()) {
      return Response.json({ status: "needs_review", message: "Invalid date range provided for Lumpsum." }, { status: 200 });
    }

    const result = calculateLumpsum(navData, amount, fromDate, toDate);
    
    // Check if calculation failed and return the error message
    if (result.status === "needs_review") {
        return Response.json(result, { status: 200 });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ message: "Error calculating Lumpsum", error: error.message }, { status: 500 });
  }
}