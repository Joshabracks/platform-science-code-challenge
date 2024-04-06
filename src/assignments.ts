import { getStreetAddresses, Address } from "./address";
import { getDrivers, Driver } from "./driver";
import { suitabilityScore } from "./suitabilityScore";

// set of indices and score for
interface SuitabilityMatch {
  driver: number;
  address: number;
  score: number;
}

interface DriverAddressMatch {
  driver: string;
  address: string;
  suitabilityScore: number;
}

interface Assignments {
  matches: DriverAddressMatch[];
  leftoverDrivers: Driver[];
  leftoverAddresses: Address[];
}

/**
 * Loads Drivers and Addresses from files and matches by suitability score ratings starting from highest to lowest possible score
 * @returns:
 *    matches: Array { driver: string, address: string, score: number }
 *    leftoverDrivers: Driver[]       remaining drivers if number of drivers is greater than addresses
 *    leftoverAddressess: Address[]   remaining addressess if number of addresses is greater than drivers
 */
function getAssignments(): Assignments {
  // get drivers and addresses from files
  let drivers: Driver[] = getDrivers();
  let addressess: Address[] = getStreetAddresses();

  const matches: DriverAddressMatch[] = []; // resulting array of matches to be returned as "matches" in return object
  while (drivers.length && addressess.length) {
    // Get highest possible SS for each driver
    const topSuitabilityMatches: SuitabilityMatch[] = [];
    drivers.forEach((driver: Driver, driverIndex: number) => {
      let topSuitabilityMatch: SuitabilityMatch = {
        driver: -1,
        address: -1,
        score: -1,
      };
      addressess.forEach((address: Address, addressIndex: number) => {
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

    // Get single highest possible match and add to matches
    let topSuitabilityMatch: SuitabilityMatch = topSuitabilityMatches[0];
    topSuitabilityMatches.forEach((match) => {
      if (match.score > topSuitabilityMatch.score) {
        topSuitabilityMatch = match;
      }
    });
    const match = {
      driver: drivers[topSuitabilityMatch.driver].name,
      address: addressess[topSuitabilityMatch.address].full,
      suitabilityScore: topSuitabilityMatch.score,
    };
    matches.push(match);

    // Remove matched driver and address from matching pools for next iteration or to trigger end of loop
    drivers = drivers.filter(
      (_, index) => index !== topSuitabilityMatch.driver
    );
    addressess = addressess.filter(
      (_, index) => index !== topSuitabilityMatch.address
    );
  }
  return {
    matches,
    leftoverDrivers: drivers,
    leftoverAddresses: addressess,
  };
}

export { getAssignments, Assignments, DriverAddressMatch };
