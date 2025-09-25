// src/app/api/scheme/[code]/sip/route.js
import { getSchemeData } from "@/utils/api";
import { calculateSip } from "@/utils/calculations";

export async function POST(request, { params }) {
  const { code } = params;
  const { amount, frequency, from, to } = await request.json();

  if (!code) {
    return Response.json({ message: "Scheme code is required" }, { status: 400 });
  }

  if (!amount || !frequency || !from || !to) {
    return Response.json({ message: "Missing required fields" }, { status: 400 });
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

    const result = calculateSip(
      navData,
      amount,
      frequency,
      new Date(from),
      new Date(to)
    );

    return Response.json(result);
  } catch (error) {
    return Response.json({
      message: "Error calculating SIP",
      error: error.message,
    }, { status: 500 });
  }
}