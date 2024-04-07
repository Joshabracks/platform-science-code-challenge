import path from "path";
import fs from "fs";
import { getStreetAddresses, Address } from "./address";
import { getDrivers, Driver } from "./driver";
import { OUTPUT_FILE, setDriverInput, setStreetAddressesInput } from "./env";
import { suitabilityScore } from "./suitabilityScore";

// set of indices and score for
interface SuitabilityMatch {
  driver: number;
  address: number;
  score: number;
}

// driver/address matches to be returned in final getAssignment results
interface DriverAddressMatch {
  driver: string;
  address: string;
  suitabilityScore: number;
}

// return object format for getAssignments
interface Assignments {
  matches: DriverAddressMatch[];
  leftoverDrivers: Driver[];
  leftoverAddresses: Address[];
}

/**
 * Loads Drivers and Addresses from files and matches by suitability score ratings starting from highest to lowest possible score
 * @param driverInput string (OPTIONAL) - Line separated list of driver names
 *                    if not provided, the program will attempt to fetch the value from .env or default specified files
 * @param addressInput  string (OPTIONAL) - Line separated list of destination street addresses
 *                    if not provided, the program will attempt to fetch the value form .env or default specified files
 * @returns:
 *    matches: DriverAddressMatch[]   set of driver / address matches with suitablity scores
 *    leftoverDrivers: Driver[]       remaining drivers if number of drivers is greater than addresses
 *    leftoverAddressess: Address[]   remaining addressess if number of addresses is greater than drivers
 */
function getAssignments(
  driverInput: string = "",
  addressInput: string = ""
): Assignments {
  // get drivers and addresses from files
  let drivers: Driver[] = getDrivers(driverInput);
  let addressess: Address[] = getStreetAddresses(addressInput);

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

/**
 * Gets StreetAddress and Driver values from files or pre-set values and creates assigns drivers to destination addresses at a 1 to 1 ration, as available
 * Assignments (along with any leftover drivers or addresses) are then either logged to console and/or exported to a file and returned
 * @param out boolean - when set to true, results are exported to a file at the OUTPUT_FILE path in json format
 *            default OUTPUT_FILE value is "../output.json" which targets the root level of the project.  (Parent level of the project build)
 * @param outputFile  string - changes the output file path.  This can also be changed in the .env file as OUTPUT.
 *                    [NOTE] If the outputFile value is set, the program will attempt to export the file regardless of the "out" parameter setting
 * @param driverNames string - changes the input file path for driver names.  This can also be set in the .env file as DRIVER_NAMES
 *                    default DRIVER_NAMES value is '../data/DriverNames.txt' which targets the data folder of the project level (Sibling level of the project build)
 * @param streetAddresses string - changes in input file path for street addresses.  This can also be set in the .env file as STREET_ADDRESSES
 *                        default STREET_ADDRESSES value is '../data/StreetAddresses.txt' which targets the data folder of the project level (Sibling level of the project build)
 * @param log boolean - if set to true, results will be logged to the console
 * @returns Assignments {
 *            matches: DriverAddressMatch[];
 *            leftoverDrivers: Driver[];
 *            leftoverAddresses: Address[];
 *          }
 */
function runAssignments(
  out: boolean = false,
  outputFile: string = "",
  driverNames: string = "",
  streetAddresses: string = "",
  log: boolean = false
): Assignments {
  // determine if streetAddresses and driverNames are input file names or input data
  const isFileRegExp = /\w+\.\w+$/;
  const driverInput = driverNames.trim().match(isFileRegExp) ? "" : driverNames;
  const addressInput = streetAddresses.trim().match(isFileRegExp)
    ? ""
    : streetAddresses;

  // update input filepath parameters
  if (driverNames && !driverInput) {
    setDriverInput(driverNames);
  }
  if (streetAddresses && !addressInput) {
    setStreetAddressesInput(streetAddresses);
  }
  // process input files and/or input data
  const assignments: Assignments = getAssignments(driverInput, addressInput);

  // log error if no assignments or leftovers
  if ( assignments.matches.length + assignments.leftoverAddresses.length + assignments.leftoverDrivers.length === 0 ) {
    console.error(
      "\u001b[31m",
      "No assignments made due to bad or no data",
      "\u001b[0m"
    );
    return assignments;
  }

  // export and/or log results
  if (log) {
    console.log(assignments);
  }
  if (out || outputFile) {
    // Save result to OUTPUT_FILE
    const filePath = path.resolve(__dirname, outputFile || OUTPUT_FILE);
    fs.writeFile(filePath, JSON.stringify(assignments, null, 2), (err) => {
      if (err) {
        console.error("\u001b[31m", err, "\u001b[0m");
      } else {
        console.log(
          "\u001b[34m",
          `Assignments saved to ${filePath}`,
          "\u001b[0m"
        );
      }
    });
  }

  return assignments;
}

export { getAssignments, runAssignments, Assignments, DriverAddressMatch };
