const http = require("http");
const httpProxy = require("http-proxy");
const ini = require("ini");
const fs = require("fs");

// Read and parse the config.ini file
const config = ini.parse(fs.readFileSync("config.ini", "utf-8"));

// Get the site URL from the configuration
const goto = config.OneSiteProxy.url;

// Get the port from the configuration
const port = config.OneSiteProxy.port || 8080;

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: false, // ⚠️ disables TLS checks (like cert altname errors)
});

// Start the HTTP server
const server = http.createServer((req, res) => {
  proxy.web(req, res, { target: goto }, (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500);
    res.end('Proxy error: ' + err.message);
  });
});

server.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port} -> ${goto}`);
});
