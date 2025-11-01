const http = require('http');
const assert = require('assert');
const { createServer } = require('../src/server');

// Start server on ephemeral port and test GET /
const server = createServer();
server.listen(0, () => {
  const { port } = server.address();
  const options = {
    hostname: '127.0.0.1',
    port,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      try {
        assert.strictEqual(res.statusCode, 200, 'Expected 200 OK');
        assert.ok(data.includes('Hello from Node 18 LTS'), 'Unexpected body');
        // success
        // eslint-disable-next-line no-console
        console.log('TEST PASS');
        server.close(() => process.exit(0));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('TEST FAIL', err && err.message);
        server.close(() => process.exit(1));
      }
    });
  });

  req.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('Request error', err.message);
    server.close(() => process.exit(1));
  });

  req.end();
});
