// src/utils/calculations.js

export const findNearestNav = (navs, date) => {
    // Prefer the nearest earlier or same date; if none, choose the closest later one
    let bestEarlier = null;
    let minEarlierDiff = Infinity;
    let bestLater = null;
    let minLaterDiff = Infinity;
    for (const nav of navs) {
      const diff = nav.date.getTime() - date.getTime();
      if (diff <= 0) {
        const d = Math.abs(diff);
        if (d < minEarlierDiff) {
          minEarlierDiff = d;
          bestEarlier = nav;
        }
      } else {
        if (diff < minLaterDiff) {
          minLaterDiff = diff;
          bestLater = nav;
        }
      }
    }
    return bestEarlier ?? bestLater;
  };
  
  export const calculateSip = (navs, amount, frequency, from, to) => {
    let totalInvested = 0;
    let totalUnits = 0;
    let datesToInvest = [];
    
    if (frequency === "monthly") {
      let currentDate = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      const endDate = new Date(to.getFullYear(), to.getMonth(), to.getDate());
      while (currentDate.getTime() <= endDate.getTime()) {
        datesToInvest.push(new Date(currentDate));
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        // Keep same day-of-month when possible
        nextMonth.setDate(Math.min(currentDate.getDate(), new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate()));
        currentDate = nextMonth;
      }
    }
  
    let investments = [];
    let cumulativeUnits = 0;
    let cumulativeInvested = 0;
  
    // Ensure NAV array is sorted by date ascending for nearest earlier lookup
    const sortedNavs = [...navs].sort((a, b) => a.date - b.date);
    for (const date of datesToInvest) {
      const nav = findNearestNav(sortedNavs, date);
      if (nav && nav.nav > 0) {
        const units = amount / nav.nav;
        totalUnits += units;
        totalInvested += amount;
  
        cumulativeUnits += units;
        cumulativeInvested += amount;
  
        investments.push({
          date: nav.date.toISOString().split("T")[0],
          nav: nav.nav,
          units: units,
          cumulativeUnits: cumulativeUnits,
          cumulativeInvested: cumulativeInvested,
          currentValue: cumulativeUnits * nav.nav,
        });
      }
    }
  
    if (totalInvested === 0) {
      return {
        status: "needs_review",
        message: "No valid investment dates found or insufficient data.",
      };
    }
  
    // NAVs from MFAPI are usually newest first; ensure we actually pick the latest (max date)
    const latest = sortedNavs.reduce((a, b) => (a && a.date > b.date ? a : b), null);
    const latestNav = latest ? latest.nav : 0;
    const currentValue = totalUnits * latestNav;
    const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
  
    const years = (to.getTime() - from.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const annualizedReturn = years >= 1 ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 : absoluteReturn;
  
    return {
      totalInvested,
      currentValue,
      totalUnits,
      absoluteReturn,
      annualizedReturn,
      investments,
    };
  };
  
  export const calculateReturns = (navs, startDate, endDate) => {
    const startNav = findNearestNav(navs, startDate);
    const endNav = findNearestNav(navs, endDate);
  
    if (!startNav || !endNav) {
      return null;
    }
  
    const simpleReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
  
    const years = (endNav.date.getTime() - startNav.date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const annualizedReturn = years >= 1 ? (Math.pow(endNav.nav / startNav.nav, 1 / years) - 1) * 100 : simpleReturn;
  
    return {
      startDate: startNav.date.toISOString().split("T")[0],
      endDate: endNav.date.toISOString().split("T")[0],
      startNAV: startNav.nav,
      endNAV: endNav.nav,
      simpleReturn,
      annualizedReturn,
    };
  };