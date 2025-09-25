// src/app/api/scheme/[code]/returns/route.js
import { getSchemeData } from "@/utils/api";
import { calculateReturns } from "@/utils/calculations";
import { getPastDate } from "@/utils/date";

export async function GET(request, { params }) {
  const { code } = params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!code) {
    return Response.json({ message: "Scheme code is required" }, { status: 400 });
  }

  try {
    const schemeData = await getSchemeData(code);
    if (!schemeData) {
      return Response.json({ message: "Scheme not found" }, { status: 404 });
    }

    const navData = schemeData.data.map((d) => ({
      date: new Date(d.date),
      nav: parseFloat(d.nav),
    }));

    let startDate;
    let endDate;

    if (period) {
      endDate = new Date();
      if (period === "1m") startDate = getPastDate(endDate, 1, "month");
      else if (period === "3m") startDate = getPastDate(endDate, 3, "month");
      else if (period === "6m") startDate = getPastDate(endDate, 6, "month");
      else if (period === "1y") startDate = getPastDate(endDate, 1, "year");
      else return Response.json({ message: "Invalid period" }, { status: 400 });
    } else if (from && to) {
      startDate = new Date(from);
      endDate = new Date(to);
    } else {
      return Response.json(
        { message: "Period or date range is required" },
        { status: 400 }
      );
    }

    const result = calculateReturns(navData, startDate, endDate);
    if (!result) {
      return Response.json(
        { message: "Calculation failed or insufficient data" },
        { status: 500 }
      );
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({
      message: "Error calculating returns",
      error: error.message,
    }, { status: 500 });
  }
}