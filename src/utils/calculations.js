// src/utils/calculations.js

export const findNearestNav = (navs, date) => {
    let closest = null;
    let minDiff = Infinity;
    for (const nav of navs) {
      const diff = Math.abs(date.getTime() - nav.date.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = nav;
      }
    }
    return closest;
  };
  
  export const calculateSip = (navs, amount, frequency, from, to) => {
    let totalInvested = 0;
    let totalUnits = 0;
    let datesToInvest = [];
    
    if (frequency === "monthly") {
      let currentDate = new Date(from);
      while (currentDate <= to) {
        datesToInvest.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
  
    let investments = [];
    let cumulativeUnits = 0;
    let cumulativeInvested = 0;
  
    for (const date of datesToInvest) {
      const nav = findNearestNav(navs, date);
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
  
    const latestNav = navs.length > 0 ? navs[0].nav : 0;
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