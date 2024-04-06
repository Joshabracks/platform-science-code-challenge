import path from 'path';
import { loadFileAsString } from "./file";
import { STREET_ADDRESSES } from "./env";

// Define Address parts to avoid type based errrors
interface Address {
  full: string;   // as it presented in the source file
  number: number; // street address number
  street: string; // street name
  city: string;   // city name
  state: string;  // state name or code
  zip: number;    // numerical zip code
}

// Used to enumerate parts of the address as expected in the file
enum AddressPart {
  NUMBER_AND_STREET,
  CITY,
  STATE,
  ZIP,
}

/**
 * Gets addresses from StreetAddresses.txt file
 * @returns Array of Address objects
 */
function getStreetAddresses(): Address[] {
  // Get file
  const filePath = path.resolve(__dirname, STREET_ADDRESSES);
  const file = loadFileAsString(filePath);
  if (typeof file !== "string") {
    console.error(file);
    return [];
  }
  // Format Addresses
  const addressess: Address[] = file.split("\n").map((line: string) => {
    const addressParts = line.split(",");
    const numberAndStreet = addressParts[AddressPart.NUMBER_AND_STREET]
      ?.trim()
      ?.split(/\s/);
    const address: Address = {
      full: line.trim(),
      number: parseInt(numberAndStreet?.[0]) || 0,
      street: numberAndStreet?.[1] || '',
      city: addressParts[AddressPart.CITY]?.trim() || "",
      state: addressParts[AddressPart.STATE]?.trim() || "",
      zip: parseInt(addressParts[AddressPart.ZIP]?.trim()) || 0,
    };
    return address;
  });
  return addressess;
}

export { getStreetAddresses, Address };
