/**
 * Gets the greatest common divisor shared between two numbers
 * @param x number
 * @param y number
 * @returns the Greatest Common divisor of x and y
 */
function greatestCommonDivisor(x: number, y: number): number {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Compares a Driver and destination Address to determine a numerical suitability value based off of the "top-secret" algorithm
 * @param driver - Driver
 * @param destination - Address
 * @returns number
 */
function suitabilityScore(driver: string, destination: string): number {
  // Calculate base SS value per the "top-secret algorithm" instructions:
  // ● If the length of the shipment's destination street name is even, the base
  //   suitability score (SS) is the number of vowels in the driver’s name multiplied by
  //   1.5.
  // ● If the length of the shipment's destination street name is odd, the base SS is the
  //   number of consonants in the driver’s name multiplied by 1.
  // ● If the length of the shipment's destination street name shares any common
  //   factors (besides 1) with the length of the driver’s name, the SS is increased by
  //   50% above the base SS
  
  const street = destination?.match(/\d+\s([^,]+)/)?.[1]?.trim() || ''
  // Determine base score
  const streetNameIsEven: boolean =
    street.length % 2 ? false : true;
  const baseLetterCount: number = streetNameIsEven
    ? driver.match(/[aeiou]/gi)?.length || 0 // vowel count
    : driver.match(/[bcdfghj-np-tv-z]/gi)?.length || 0; // consonant count
  const base: number = streetNameIsEven
    ? baseLetterCount * 1.5
    : baseLetterCount;

  // Determine if common factors exist
  const streetNameLength: number = street.length;
  const driverNameLength: number = driver.length;
  const gcd: number = greatestCommonDivisor(streetNameLength, driverNameLength);
  const hasCommonFactors: boolean =
    gcd > 1 && gcd !== streetNameLength && gcd !== driverNameLength;

  // set suitability score and apply 50% increase if common factors exist
  const ss: number = hasCommonFactors ? base * 1.5 : base;
  return ss;
}

export { suitabilityScore };
