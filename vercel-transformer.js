const fs = require('fs');
const path = require('path');

// This transformer will generate a `vercel.json` config file, based on the application
// environment config and custom headers.
module.exports = ({ headers }) => {
  const config = {
    // https://vercel.com/docs/cli#project-configuration/rewrites
    rewrites: [
      {
        source: '/(login|logout)',
        destination: '/api/fallback',
      },
      {
        source: '/:path*',
        destination: '/index.html',
      },
    ],
    // https://vercel.com/docs/cli#project-configuration/headers
    headers: [
      {
        source: '/:path*',
        headers: Object.entries(
          Object.assign({ 'Cache-Control': 'no-cache' }, headers)
        ).map(([key, value]) => ({ key, value })),
      },
    ],
  };
  fs.writeFileSync(
    path.join(__dirname, `vercel.json`),
    JSON.stringify(config, null, 2),
    { encoding: 'utf8' }
  );
};
