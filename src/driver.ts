import { loadFileAsString } from "./file";
import path from "path";

interface Driver {
  name: string;         // full name as it is respresented in the file,
  nameCondensed: string // full name with white-space and special characters removed
}

/**
 * Gets Driver Names from DriverNames.txt file
 * @returns array of Drivers with names set to lower case
 */
function getDrivers(): Driver[] {
  // Get file
  const filePath = path.resolve(__dirname, "../data/DriverNames.txt");
  const file = loadFileAsString(filePath);
  if (typeof file !== "string") {
    console.error(file);
    return [];
  }
  // Format drivers
  const driverNames = file.split("\n").map((line: string) => {
    const nameTrimmed = line.trim();
    const driver: Driver = {
      name: nameTrimmed,
      nameCondensed: nameTrimmed.replace(/[^A-Za-z]/g, '')
    };
    return driver;
  });
  return driverNames;
}

export { getDrivers, Driver };
