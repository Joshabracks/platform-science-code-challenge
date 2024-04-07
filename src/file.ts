import fs from "fs";

/**
 * Helper function to load files as string
 * @param filePath - string filepath for file to be loaded.
 * NOTE: Upon copy-files or build-and-start process, files will be copied from the project "data" folder into the root of the build folder
 * @returns file contents as string or Error
 */
function loadFileAsString(filePath: string): {
  result: string;
  err: Error | null;
} {
  if (!fs.existsSync(filePath)) {
    return {
      result: "",
      err: new Error(
        `Cannot load file at "${filePath}". \n \u001b[31mFile does not exist\u001b[0m`
      ),
    };
  }
  const file = fs.readFileSync(filePath);
  return { result: file.toString(), err: null };
}

export { loadFileAsString };
