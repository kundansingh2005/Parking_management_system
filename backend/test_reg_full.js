const http = require('http');

const data = JSON.stringify({
  name: 'Random Tester',
  email: `rand_${Date.now()}@test.com`,
  password: 'password123',
  role: 'admin',
  location: 'Test Location',
  total_slots: 10
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => require('fs').writeFileSync('reg_error_output.txt', body));
});

req.on('error', e => require('fs').writeFileSync('reg_error_output.txt', String(e)));
req.write(data);
req.end();
