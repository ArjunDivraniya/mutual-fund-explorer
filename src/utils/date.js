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