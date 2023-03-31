const { createProxyMiddleware } = require("http-proxy-middleware");

const express = require("express");
const app = express();

const proxy = createProxyMiddleware({
  target: "http://localhost:5000",
  changeOrigin: true,
});

app.use("/api", proxy);

module.exports = app;
