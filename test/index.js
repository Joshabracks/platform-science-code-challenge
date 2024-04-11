// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const suitabilityScore = require('../build/suitabilityScore').suitabilityScore

const blue = "\u001b[34m"
const red = "\u001b[31m"
const reset = "\u001b[0m"

const SS_CASES = [
    // The first case is the only case given in the design spec.
    //      Original assumption for name length was that it would not include spaces.
    //      This assumption was debunked during first round of case testing when original results were not returning as expected.
    //      "nameCondensed" is a version of the name with all white space and special characters removed.
    //          It is used to determine number of consonants by subtracting the number of vowels from the length.
    //      "street" is trimmed, but not otherwise cleaned of any spaces or special characters

    {
        // TEST CASE 1
        // street name length: 8
        // driver's name length: 15
        // base multiplier: 1.5 (even street)
        // number of vowels: 6
        // 6 * 1.5 = 9
        // base SS: 9
        // common factors (other than 1): none
        // No further multipliers: use base SS (9)
        driver: 'Daniel Davidson',
        address: '44 Fake Dr., San Diego, CA, 92122',
        expect: 9
    },
    // Further test cases only have information required to run the suitabilityScore function properly
    {
        // TEST CASE 2
        // street name length: 14
        // driver's name length: 12
        // base multiplier: 1.5 (even street)
        // number of vowels: 4
        // 4 * 1.5 = 6
        // base SS: 6
        // common factors (other than 1): 2
        // 6 * 1.5 = 9
        driver: 'Bob Dolewhip',
        address: '123 Moneybags Lane, Williamsburg, IN, 55555',
        expect: 9
    },
    {
        // TEST CASE 3
        // street name length: 13
        // driver's name length: 7
        // base multiplier: 1 (odd street)
        // number of consonants: 4
        // base SS: 4
        // common factors (other than 1): none
        // No further multipliers: use base SS (4)
        driver: 'Bob Obb',
        address: ' 990 Paseo Roberto, Singleton, WA, 49813',
        expect: 4
    },
    {
        // TEST CASE 4 
        // (My last name is two words with a space.  So, I figured it would make a good edge case)
        // street name length: 14
        // driver's name length: 21
        // base multiplier: 1.5 (even street)
        // number of vowels: 7
        // 7 * 1.5 = 10.5
        // common factors (other than 1): 7
        // 10.5 * 1.5 = 15.75
        driver: 'Joshua Almanza Bracks',
        address: '405 Corona Del Mar, Someplace, CA, 91710',
        expect: 15.75
    }
]

// eslint-disable-next-line no-undef
console.log("Running test...")

let successfulCases = 0;
SS_CASES.forEach(({ driver, address, expect }, index) => {
    const ss = suitabilityScore(driver, address)
    const success = ss === expect
    if (success) {
        successfulCases++;
    }
    // eslint-disable-next-line no-undef
    console.assert(success, `
    ${red}TEST CASE ${index + 1}${reset}
        Expected: ${expect}
        Got: ${ss}`)
});

const color = successfulCases === SS_CASES.length ? blue : red
// eslint-disable-next-line no-undef
console.log(`${color}${successfulCases} out of ${SS_CASES.length} passed${reset}`)
