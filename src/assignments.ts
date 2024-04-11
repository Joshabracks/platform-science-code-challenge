import path from "path";
import fs from "fs";
import { getStreetAddresses } from "./address";
import { getDrivers } from "./driver";
import { OUTPUT_FILE, setDriverInput, setStreetAddressesInput } from "./env";
import { suitabilityScore } from "./suitabilityScore";

// driver/address matches to be returned in final getAssignment results
interface DriverAddressMatch {
  driver: string;
  address: string;
}

/**
 * Helper function to get possible driver/address combinations by index
 * @param addresses   string[] Array of address
 * @param drivers     string[] Array of driver names
 * @param _current number[] (default []) Do not set this value
 * @returns   array of suitability scores and number arrays that represent driver/address combinations
 *            The place in the array represents the driver index and the actual number represents the address index
 */
function getCombinationsAndSuitabilityScores(
  drivers: string[],
  addresses: string[],
  _current: number[] = []
): { ss: number; matches: number[] }[] {
  if (_current.length === drivers.length) {
    // Permutation list is complete.  Calculate SS and return list with SS
    const ss = _current.reduce((result, addressIndex, driverIndex) => {
      return (
        result + suitabilityScore(drivers[driverIndex], addresses[addressIndex])
      );
    }, 0);
    return [{ ss, matches: _current }];
  }
  // Compile permutation lists recursively
  let results: { ss: number; matches: number[] }[] = [];
  for (let i = 0; i < addresses.length; i++) {
    if (_current.indexOf(i) === -1) {
      const next = structuredClone(_current);
      next.push(i);
      results = results.concat(
        getCombinationsAndSuitabilityScores(drivers, addresses, next)
      );
    }
  }
  return results;
}

/**
 * Loads Drivers and Addresses from files and matches by suitability score ratings starting from highest to lowest possible score
 * @param driverInput string (OPTIONAL) - Line separated list of driver names
 *                    if not provided, the program will attempt to fetch the value from .env or default specified files
 * @param addressInput  string (OPTIONAL) - Line separated list of destination street addresses
 *                    if not provided, the program will attempt to fetch the value form .env or default specified files
 * @returns:
 *    ss: number - total suitability score
 *    matches: DriverAddressMatch[]   set of driver / address matches with
 */
function getAssignments(
  driverInput: string = "",
  addressInput: string = ""
): { ss: number; matches: DriverAddressMatch[] } {
  // get drivers and addresses from files
  const drivers: string[] = getDrivers(driverInput);
  const addresses: string[] = getStreetAddresses(addressInput);
  const possibleCombinations = getCombinationsAndSuitabilityScores(
    drivers,
    addresses
  );

  // Tally sum of suitability scores for each permutation and assign the top score/index
  let topIndex = 0;
  let topScore = 0;
  possibleCombinations.forEach((combination, index) => {
    if (combination.ss > topScore) {
      topScore = combination.ss;
      topIndex = index;
    }
  });

  // Compile and return matches with scores
  const matches: DriverAddressMatch[] = possibleCombinations[
    topIndex
  ].matches.map((addressIndex, driverIndex) => {
    return {
      driver: drivers[driverIndex] || "",
      address: addresses[addressIndex] || "",
    };
  });

  return { ss: topScore, matches };
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
 * @returns 
 *    ss: number - total suitability score
 *    matches: DriverAddressMatch[]   set of driver / address matches with
 */
function runAssignments(
  out: boolean = false,
  outputFile: string = "",
  driverNames: string = "",
  streetAddresses: string = "",
  log: boolean = false
): { ss: number; matches: DriverAddressMatch[] } {
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
  const assignments = getAssignments(driverInput, addressInput);

  // log error if no assignments or leftovers
  if (assignments.matches.length === 0) {
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

export { getAssignments, runAssignments, DriverAddressMatch };
