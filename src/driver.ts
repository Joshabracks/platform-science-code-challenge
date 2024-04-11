import path from "path";
import { loadFileAsString } from "./file";
import { DRIVER_NAMES } from "./env";

/**
 * Formats string input for Drivers
 * @param addressInput  string - String input to be formatted into array of Drivers
 *                      If value is not supplied, the program will attempt to retrieve the input via a file path configured at environment level
 * @returns array of Driver objects
 */
function getDrivers(driverInput: string = ''): string[] {
  if (!driverInput) {
    // Get input from file
    const filePath = path.resolve(__dirname, DRIVER_NAMES);
    const {result, err} = loadFileAsString(filePath)
    if (err) {
      console.error(err);
      return [];
    }
    driverInput = result;
  }
  // Format drivers
  const drivers = driverInput.split("\n").map((line: string) => line.trim());

  return drivers;
}

export { getDrivers };
