import { getStreetAddresses } from "./address";
import { getDrivers } from "./driver";
import { suitabilityScore } from "./suitabilityScore";

interface SuitabilityMatch {
  driver: number;
  address: number;
  score: number;
}

function getAssignments() {
  let drivers = getDrivers();
  let addressess = getStreetAddresses();
  const matches = [];
  while (drivers.length && addressess.length) {
    const topSuitabilityMatches: SuitabilityMatch[] = [];
    drivers.forEach((driver, driverIndex) => {
      let topSuitabilityMatch: SuitabilityMatch = {
        driver: -1,
        address: -1,
        score: -1,
      };
      addressess.forEach((address, addressIndex) => {
        const ss = suitabilityScore(driver, address);
        if (ss > topSuitabilityMatch.score) {
          topSuitabilityMatch = {
            driver: driverIndex,
            address: addressIndex,
            score: ss,
          };
        }
      });
      topSuitabilityMatches.push(topSuitabilityMatch);
    });

    let topSuitabilityMatch: SuitabilityMatch = topSuitabilityMatches[0];
    topSuitabilityMatches.forEach((match) => {
      if (match.score > topSuitabilityMatch.score) {
        topSuitabilityMatch = match;
      }
    });
    const match = {
      driver: drivers[topSuitabilityMatch.driver].name,
      addresss: addressess[topSuitabilityMatch.address].full,
      suitabilityScore: topSuitabilityMatch.score,
    };
    matches.push(match);
    drivers = drivers.filter(
      (_, index) => index !== topSuitabilityMatch.driver
    );
    addressess = addressess.filter(
      (_, index) => index !== topSuitabilityMatch.address
    );
  }
  return { matches, leftOverDrivers: drivers, leftOverAddresses: addressess };
}

console.log(getAssignments())
