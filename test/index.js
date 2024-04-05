// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const suitabilityScore = require('../build/suitabilityScore').suitabilityScore
const SS_CASES = [
    {
        driver: { firstName: 'daniel', lastName: 'davidson', fullName: 'Daniel Davidson' },
        address: { number: 44, street: 'Fake Dr.', city: 'San Diego', state: 'CA', zip: 92122 },
        expect: 9
    }
]

SS_CASES.forEach(({ driver, address, expect }) => {
    const ss = suitabilityScore(driver, address)
    // eslint-disable-next-line no-undef
    console.assert(ss === expect, `\n   Expected: ${expect} \n   Got: ${ss}`)
})