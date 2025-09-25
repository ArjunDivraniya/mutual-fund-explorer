// src/app/api/scheme/[code]/sip/route.js
import { calculateSip } from "@/utils/calculations";
import { parseMfapiDateString } from "@/utils/date";

export async function POST(request, { params }) {
  const { code } = await params;
  const { amount, frequency, from, to } = await request.json();

  if (!code) {
    return Response.json({ message: "Scheme code is required" }, { status: 400 });
  }

  if (!amount || !frequency || !from || !to) {
    return Response.json({ message: "Missing required fields" }, { status: 400 });
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
      .map((d) => ({
        date: parseMfapiDateString(d.date),
        nav: parseFloat(d.nav),
      }))
      .filter((d) => Number.isFinite(d.nav) && !Number.isNaN(d.date.getTime()))
      .sort((a, b) => a.date - b.date);

    const earliest = navData.reduce((a, b) => (a && a.date < b.date ? a : b), null)?.date;
    const latest = navData.reduce((a, b) => (a && a.date > b.date ? a : b), null)?.date;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Clamp requested range to available NAV window
    const clampedFrom = earliest && fromDate < earliest ? earliest : fromDate;
    const clampedTo = latest && toDate > latest ? latest : toDate;
    if (!(clampedFrom instanceof Date) || isNaN(clampedFrom) || !(clampedTo instanceof Date) || isNaN(clampedTo) || clampedFrom > clampedTo) {
      return Response.json({ status: "needs_review", message: "Invalid or unsupported date range for SIP." }, { status: 200 });
    }

    const result = calculateSip(
      navData,
      amount,
      frequency,
      clampedFrom,
      clampedTo
    );

    return Response.json(result);
  } catch (error) {
    return Response.json({
      message: "Error calculating SIP",
      error: error.message,
    }, { status: 500 });
  }
}