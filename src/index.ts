import fs from "fs";
import path from "path";
import { getAssignments } from "./assignments";

function runAssignments() {
  console.log("Running Assignments");
  const assignments = getAssignments();
  // OUTPUT path is editable via .env file
  const out = process?.env?.OUTPUT || "";
  if (out) {
    // Save result to OUTPUT file
    const filePath = path.resolve(__dirname, out);
    fs.writeFile(filePath, JSON.stringify(assignments, null, 2), (err) => {
      if (err) {
        console.error("\u001b[31m", err, "\u001b[0m");
      } else {
        console.log("\u001b[34m", `Assignments saved to ${filePath}`, "\u001b[0m");
      }
    });
  } else {
    // if no OUTPUT path is defined via .env file, print assignment results instead
    console.log(assignments);
  }
}

export { runAssignments };
