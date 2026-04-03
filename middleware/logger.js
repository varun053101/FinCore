const morgan = require("morgan");

// Use the detailed dev format locally; fall back to a compact single-line
// format in production to keep logs machine-readable and concise.
const format =
  process.env.NODE_ENV === "production"
    ? ":remote-addr :method :url :status :res[content-length] - :response-time ms"
    : "dev";

module.exports = morgan(format);
