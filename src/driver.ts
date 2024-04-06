import path from "path";
import { loadFileAsString } from "./file";
import { DRIVER_NAMES } from "./env";

interface Driver {
  name: string;         // as it is respresented in the file,
  nameCondensed: string // white-space and special characters removed
}

/**
 * Gets Driver Names from DriverNames.txt file
 * @returns array of Drivers with names set to lower case
 */
function getDrivers(): Driver[] {
  // Get file
  const filePath = path.resolve(__dirname, DRIVER_NAMES);
  const file = loadFileAsString(filePath);
  if (typeof file !== "string") {
    console.error(file);
    return [];
  }
  // Format drivers
  const drivers = file.split("\n").map((line: string) => {
    const nameTrimmed = line.trim();
    const driver: Driver = {
      name: nameTrimmed,
      nameCondensed: nameTrimmed.replace(/[^A-Za-z]/g, '').toLowerCase()
    };
    return driver;
  });
  return drivers;
}

export { getDrivers, Driver };
