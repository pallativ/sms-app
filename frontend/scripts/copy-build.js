const fs = require("fs-extra");
const path = require("path");

const source = path.join(__dirname, "../build"); // Default React build directory
const destination = path.join(__dirname, "../../build"); // Outside project directory

fs.copy(source, destination)
  .then(() => console.log("Build files copied to:", destination))
  .catch((err) => console.error("Error copying build files:", err));
