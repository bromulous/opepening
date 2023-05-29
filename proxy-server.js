const cors_anywhere = require("cors-anywhere");

const host = "localhost";
const port = 8080;

cors_anywhere.createServer().listen(port, host, () => {
  console.log(`Running CORS Anywhere on ${host}:${port}`);
});