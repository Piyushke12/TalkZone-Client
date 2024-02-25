const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Use the REACT_APP_API_URL environment variable as the proxy URL
  const apiProxyTarget = process.env.REACT_APP_SERVER_URL;

  // Proxy API requests to the server
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiProxyTarget,
      changeOrigin: true,
    })
  );
};
