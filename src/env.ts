// Environment variables set either at the .env file level or as the following defaults
let STREET_ADDRESSES: string =
  process?.env?.STREET_ADDRESSES || "../data/StreetAddresses.txt";
let DRIVER_NAMES: string =
  process?.env?.DRIVER_NAMES || "../data/DriverNames.txt";
const OUTPUT_FILE: string = process?.env?.OUTPUT || "../output.json";

// setter functions for changing input filepaths at function level
function setDriverInput(filePath: string) {
  DRIVER_NAMES = filePath;
}

function setStreetAddressesInput(filePath: string) {
  STREET_ADDRESSES = filePath;
}

export {
  STREET_ADDRESSES,
  DRIVER_NAMES,
  OUTPUT_FILE,
  setDriverInput,
  setStreetAddressesInput,
};
