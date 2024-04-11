import path from "path";
import { loadFileAsString } from "./file";
import { STREET_ADDRESSES } from "./env";

/**
 * Formats string input for Addresses
 * @param addressInput  string - String input to be formatted into array of Addresses
 *                      If value is not supplied, the program will attempt to retrieve the input via a file path configured at environment level
 * @returns Array of Address objects
 */
function getStreetAddresses(addressInput: string = ""): string[] {
  if (!addressInput) {
    // Get input from file
    const filePath = path.resolve(__dirname, STREET_ADDRESSES);
    const { result, err } = loadFileAsString(filePath);
    if (err) {
      console.error(err);
      return [];
    }
    addressInput = result;
  }
  // Format Addresses
  const addressess: string[] = addressInput.split("\n").map((line: string) => line.trim());

  return addressess;
}

export { getStreetAddresses };
