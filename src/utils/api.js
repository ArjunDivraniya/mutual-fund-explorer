// src/utils/api.js
const BASE_URL = "/api";

export const getSchemes = async () => {
  const res = await fetch(`${BASE_URL}/mf`);
  if (!res.ok) {
    throw new Error("Failed to fetch schemes");
  }
  const data = await res.json();
  return data.data;
};

export const getSchemeData = async (code) => {
  const res = await fetch(`${BASE_URL}/scheme/${code}`);
  if (!res.ok) {
    throw new Error("Failed to fetch scheme data");
  }
  const data = await res.json();
  return data;
};

export const calculateSipReturns = async (code, body) => {
  const res = await fetch(`${BASE_URL}/scheme/${code}/sip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error("Failed to calculate SIP returns");
  }
  const data = await res.json();
  return data;
};