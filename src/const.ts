const STREET_ADDRESSES =
  process?.env?.STREET_ADDRESSES || "../data/StreetAddresses.txt";
const DRIVER_NAMES: string =
  process?.env?.DRIVER_NAMES || "../data/DriverNames.txt";

export { STREET_ADDRESSES, DRIVER_NAMES };
