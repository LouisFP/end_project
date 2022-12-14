require("dotenv").config();

const SERVER_PORT = process.env.SERVER_PORT;

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:${SERVER_PORT}`,
      changeOrigin: true,
    })
  );
};
