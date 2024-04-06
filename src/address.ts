import path from "path";
import { loadFileAsString } from "./file";
import { STREET_ADDRESSES } from "./env";

// Define Address parts to avoid type based errrors
interface Address {
  full: string; // as it presented in the source file
  number: number; // street address number
  street: string; // street name
  city: string; // city name
  state: string; // state name or code
  zip: number; // numerical zip code
}

// Used to enumerate parts of the address as expected in the file
enum AddressPart {
  NUMBER_AND_STREET,
  CITY,
  STATE,
  ZIP,
}

/**
 * Formats string input for Addresses
 * @param addressInput  string - String input to be formatted into array of Addresses
 *                      If value is not supplied, the program will attempt to retrieve the input via a file path configured at environment level
 * @returns Array of Address objects
 */
function getStreetAddresses(addressInput: string = ""): Address[] {
  if (!addressInput) {
    // Get input from file
    const filePath = path.resolve(__dirname, STREET_ADDRESSES);
    const { result, err } = loadFileAsString(filePath);
    if (err) {
      console.error(addressInput);
      return [];
    }
    addressInput = result;
  }
  // Format Addresses
  const addressess: Address[] = addressInput.split("\n").map((line: string) => {
    const addressParts = line.split(",");
    const numberAndStreet = addressParts[AddressPart.NUMBER_AND_STREET]
      ?.trim()
      ?.split(/\s/);
    const address: Address = {
      full: line.trim(),
      number: parseInt(numberAndStreet?.[0]) || 0,
      street: numberAndStreet?.[1] || "",
      city: addressParts[AddressPart.CITY]?.trim() || "",
      state: addressParts[AddressPart.STATE]?.trim() || "",
      zip: parseInt(addressParts[AddressPart.ZIP]?.trim()) || 0,
    };
    return address;
  });

  return addressess;
}

export { getStreetAddresses, Address };
