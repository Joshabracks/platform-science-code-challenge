import { Driver } from "./driver";
import { Address } from "./address";

const VOWELS = "aeiouAEIOU";

/**
 * Gets the number of vowels in a word
 * @param word
 * @returns number
 */
function countVowels(word: string): number {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const char = word.charAt(i);
    if (VOWELS.indexOf(char) !== -1 && char !== " ") {
      count++;
    }
  }
  return count;
}

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
function suitabilityScore(driver: Driver, destination: Address): number {
  // Calculate base SS value per the "top-secret algorithm" instructions:
  // ● If the length of the shipment's destination street name is even, the base
  //   suitability score (SS) is the number of vowels in the driver’s name multiplied by
  //   1.5.
  // ● If the length of the shipment's destination street name is odd, the base SS is the
  //   number of consonants in the driver’s name multiplied by 1.
  // ● If the length of the shipment's destination street name shares any common
  //   factors (besides 1) with the length of the driver’s name, the SS is increased by
  //   50% above the base SS 

  // Determine base score
  const streetNameIsEven: boolean = destination.street.length % 2 ? false : true;
  const vowels = countVowels(driver.name);
  const baseLetterCount: number = streetNameIsEven
    ? vowels
    : driver.nameCondensed.length - vowels;
  const baseMultiplier: number = streetNameIsEven ? 1.5 : 1;
  const base: number = baseLetterCount * baseMultiplier;
  // Determine if common factors exist
  const streetNameLength = destination.street.length;
  const driverNameLength = driver.name.length;
  const gcd: number = greatestCommonDivisor(streetNameLength, driverNameLength);
  const hasCommonFactors: boolean =
    gcd > 1 && gcd !== streetNameLength && gcd !== driverNameLength;
  // set suitability score and apply 50% increase if common factors exist
  const ss: number = hasCommonFactors ? base * 1.5 : base;
  return ss;
}

export { suitabilityScore };
