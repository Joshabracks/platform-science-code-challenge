# Platform Science Code Challenge Submission
This Submission is written primarily in **TypeScript** with the unit tests written in **JavaScript**.  For my own testing purposes, I slightly extended the scope of the project to allow for some environmental editing, extra CLI inputs and unit testing.  Also, as I'm used to writing in-house tools and SDKs, I designed the project as a package that can be imported or published (though I did not publish it).  I know that this isn't going to be used outside of the challenge, but it's how I would design a project like this if I were doing so within an organization.

Most of the matching logic is spread across the [suitabilityScore](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/src/suitabilityScore.ts#L44) function, which determines the SS for a given driver/address pair and the [getAssignments](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/src/assignments.ts#L40) function, which determines what driver ultimately gets sent to what address.  The `suitabilityScore` function follows the "top-secret-algorithm" logic.  The `getAssignments` function sorts drivers like so:
 - Determine all possible driver/address group permutations
 - Determine the combined suitability scores for all groups
 - return the group with the highest combined suitability scores

This method does not account for an un-even number of drivers and addresses and will treat both lists (drivers and addresses) as separate queues.  If a greater number of addresses, are given than drivers, the algorithm will ignore addresses that are further down the queue than there are drivers. (and vise versa)  Because of this, queues should be managed outside of this application to ensure some level of fairness for drivers.  (Likely a queue that prioritises drivers who have gone longest without jobs)

### Requirements
- **node version 20 or higher** is reccomended to make use of all available features.  (Specifically environment changes via the .env file)
- **node version 18** or higher can be used with most features

### Installation
- Make sure your node version is up to date using your preferred version manager.  I use Node Version Manager:  [The official install and update guide is available here](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
- If you do not have node installed and do not wish to use an update manager, you can [download it directly from the nodejs website here](https://nodejs.org/en/download/current)
- Once your node environment is installed/update to date, copy or clone this repo via [git](https://git-scm.com/downloads)
```
git clone https://github.com/Joshabracks/platform-science-code-challenge.git
```
- Once cloned, you can navigate to the clone folder `cd platform-science-code-challenge` and install all required dependencies using `npm ci`(reccommended) or `npm i`
- Finally, you must build the project via `npm run build`

### Default Data
Under the data folder, you'll find two files:
- **DriverNames.txt**: This file contains a list of line-separated Driver Names and is the default input point for Driver Name data for the project.
- **StreetAddresses.txt**: This file contains a list of line-separated Street Addresses and is the default input point for Street Addresses.  In addition to the addressess being line-separated, each address has the following comma-separated values:
  - **address**: number and street name in that order
  - **city**: city name
  - **state**: two character state code
  - **zip**: numerical zip code

*Incorrect file format will result in errors or erroneous results*

### Default Operation
- To run the program with default settings, use `npm start`
  - This will get data from the `./data/DriverNames.txt` and `./data/StreetAddresses.txt` and process assignments accordingly, then export the results to an `./output.json` file at the root level.  ***If the output file already exists, it will be overwritten.***
- The results in the output file include the following:
  - **matches**: An array of driver/address matches along with their suitability

### .env Operation
- If you are using node version 20 or higher, you may edit the input and output filepaths via the .env file. All of the editable values are filepaths which are aimed at the `./build` folder.  The .env file provided in the project is already populated with the project's default values.
  - **OUTPUT**: the output target to export results to
  - **STREET_ADDRESSES**: the input target for destination street address data
  - **DRIVER_NAMES**: the input target for destination driver names
- ***NOTE:*** If either of the input targets (DRIVER_NAMES or STREET_ADDRESSES) are updated, make sure the input files are available exactly where they have been directed to, or the program will have errors. 
- Once you've made your preferred updates, you must use `npm run start:env` to run the program and access the .env file settings.

### Use as a Dependancy
- The package is not published, but you can access it via other packages by pointing your depencencies to the `index.js` file located within the build folder by editing your project's `package.json` dependencies.  Keep in mind that this will only work for locally compiled builds.
```json
    "dependencies": {
        "platform-science-code-challenge": "<absolute path to this repo>/build/index.js"
    }
```
#### Exported Methods
- [getAssignments](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/src/assignments.ts#L36): Loads Drivers and Addresses from files and matches by suitability score ratings starting from highest to lowest possible score

  - **parameters**: 
    - **driverInput**: string (OPTIONAL) - Line separated list of driver names or file path.  if not provided, the program will attempt to fetch the value from .env or default specified files.  If a filepath is given, the file must have a file extension, or it the program will attempt to read it as a list instead of fetching from the file.
    - **addressInput**:  string (OPTIONAL) - Line separated list of destination street addresses or filepath. if not provided, the program will attempt to fetch the value form .env or default specified files.  If a filepath is given, the file must have a file extension, or it the program will attempt to read it as a list instead of fetching from the file.
  - **returns**: [DriverAddressMatch](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/src/assignments.ts#L16)[ ] - set of driver / address matches with suitablity scores

- [runAssignments](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/src/assignments.ts#L36): Gets StreetAddress and Driver values from files or pre-set values and creates assigns drivers to destination addresses at a 1 to 1 ration, as available Assignments (along with any leftover drivers or addresses) are thn either logged to console and/or exported to a file and returned
  - **parameters**:
    - **out**: boolean - when set to true, results are exported to a file at the OUTPUT_FILE path in json format.  default OUTPUT_FILE value is "../output.json" which targets the root level of the project.  (Parent level of the project build)
    - **outputFile**: string - changes the output file path.  This can also be changed in the .env file as OUTPUT. [NOTE] If the outputFile value is set, the program will attempt to export the file regardless of the "out" parameter setting
    - **driverNames**: string - changes the input file path for driver names.  This can also be set in the .env file as DRIVER_NAMES. default DRIVER_NAMES value is '../data/DriverNames.txt' which targets the data folder of the project level (Sibling level of the project build)
    - **streetAddresses**: string - changes in input file path for street addresses.  This can also be set in the .env file as STREET_ADDRESSES. default STREET_ADDRESSES value is '../data/StreetAddresses.txt' which targets the data folder of the project level (Sibling level of the project build)
    - **log**: boolean - if set to true, results will be logged to the console
  - **returns**: [DriverAddressMatch](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/src/assignments.ts#L16)[ ] - set of driver / address matches with suitablity scores

### Advanced CLI commands
node allows exported functions to be run directly from the command line.  As a result, you can run the `runAssignments` function from the cli using `node -e` command.  (see the [package.json](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/package.json#L11) "start" script for a simple example).  The syntax for calling the function is JavaScript and must start by requiring the file you wish to export from.  (In this case, it is `./build/index.js`)

Here are a few more CLI examples
- runs with the default inputs and logs results to the console
```
node -e "require('./build/index.js').runAssignments(true, '../alt_output.json', '', '', true)"
```
- runs input as name and address and prints one match with suitability score
```
node -e "require('./build/index.js').runAssignments(false, '', 'Fake Name', '888 Fake Lane, Fake City, CA, 55555', true)"
```
- gets data from alternate input files and saves to default output file.  In order for this example to work, you would have to add the appropriate input files `AltStreetAddresses.txt` and `AltDriverNames.txt` to the `./data` folder.  If the files do not exist, an appropriate error will show in console.
```
node -e "require('./build/index.js').runAssignments(true, '', '../data/AltDriverNames.txt', '../data/AltStreetAddresses.txt', false)"
```

### Development and Unit Testing
- run unit test: `npm run test`
  - The unit test runs a group of verified driver/address pairs against the [suitabilityScore](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/src/suitabilityScore.ts#L44) function.  If any unexpected values occur, they will be logged to the console.  Otherwise, it'll show that all passed.  Any updates to the `suitabilityScore` may end in failed cases.  If this happens, either the [cases](https://github.com/Joshabracks/platform-science-code-challenge/blob/main/test/index.js#L8) need to be re-evaluated (due to an updated "top-secret" algorithm) or the function is not operating as intended and needs to be fixed.
- run lint: `npm run lint`