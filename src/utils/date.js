// src/utils/date.js
export const getPastDate = (date, value, unit) => {
    const newDate = new Date(date);
    if (unit === "month") {
      newDate.setMonth(newDate.getMonth() - value);
    } else if (unit === "year") {
      newDate.setFullYear(newDate.getFullYear() - value);
    }
    return newDate;
  };

// MFAPI dates are in DD-MM-YYYY format; construct a correct Date object reliably
export const parseMfapiDateString = (dateString) => {
  if (!dateString || typeof dateString !== "string") return new Date(NaN);
  const parts = dateString.split("-");
  if (parts.length !== 3) return new Date(NaN);
  const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
  return new Date(yyyy, (mm || 1) - 1, dd || 1);
};