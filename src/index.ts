import fs from "fs";
import path from "path";
import { getAssignments, Assignments } from "./assignments";
import { OUTPUT_FILE, setDriverInput, setStreetAddressesInput } from "./env";

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
  log: boolean = false,
): Assignments {
  // update input filepath parameters
  if (driverNames) {
    setDriverInput(driverNames);
  }
  if (streetAddresses) {
    setStreetAddressesInput(streetAddresses);
  }

  // process input files
  const assignments: Assignments = getAssignments();

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

export { runAssignments, getAssignments };
