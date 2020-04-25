const fs = require("fs");
const path = require("path");

const headersStaticFiles = { "cache-control": "s-maxage=31536000,immutable" };

// This transformer will generate a `now.json` config file, based on the application
// environment config and custom headers.
module.exports = ({ headers }) => {
  const config = {
    version: 2,
    public: true,
    builds: [
      { src: "public/**", use: "@now/static" },
      { src: "now-deployment/routes/fallback.js", use: "@now/node" },
    ],
    routes: [
      {
        src: "/(.*).(js.map|js|css|txt|html|png)",
        dest: "/public/$1.$2",
        headers: headersStaticFiles,
      },
      { src: "/(login|logout)", dest: "/now-deployment/routes/fallback.js" },
      {
        src: "/(.*)",
        // eslint-disable-next-line
        headers: Object.assign({ "Cache-Control": "no-cache" }, headers),
        dest: "/public/index.html",
      },
    ],
  };
  fs.writeFileSync(
    path.join(__dirname, `../now.json`),
    JSON.stringify(config, null, 2),
    { encoding: "utf8" }
  );
};
