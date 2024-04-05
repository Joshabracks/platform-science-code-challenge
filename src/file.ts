import fs from "fs";

/**
 * Helper function to load files as string
 * @param filePath - string filepath for file to be loaded.
 * NOTE: Upon copy-files or build-and-start process, files will be copied from the project "data" folder into the root of the build folder
 * @returns file contents as string or Error
 */
function loadFileAsString(filePath: string): string | Error {
  if (!fs.existsSync(filePath)) {
    return new Error(
      `Cannot load file at "${filePath}". \n File does not exist`
    );
  }
  const file = fs.readFileSync(filePath);
  return file.toString();
}

export { 
  loadFileAsString,
};
