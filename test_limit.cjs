const https = require('https');

function putPlain(url, data) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let resp = '';
      res.on('data', chunk => resp += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: resp, headers: res.headers }));
    });
    req.on('error', err => resolve({ error: err.message }));
    req.write(body);
    req.end();
  });
}

async function testLimits() {
  // Generate a mock base64 string of ~40KB
  const fakeBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(40000);
  console.log('Testing payload with 40KB base64 avatar...');
  const payload = {
    test: 'base64_avatar_test',
    updatedAt: new Date().toISOString(),
    avatar: fakeBase64
  };

  const payloadSize = Buffer.byteLength(JSON.stringify(payload));
  console.log('Payload size:', payloadSize);

  const res = await putPlain('https://extendsclass.com/api/json-storage/bin/ceaeeff', payload);
  console.log('PUT status:', res.status);
  console.log('Response body:', res.body?.substring(0, 300));
}

testLimits();
