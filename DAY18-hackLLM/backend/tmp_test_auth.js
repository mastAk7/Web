const axios = require('axios').default;
(async () => {
  const base = 'http://localhost:4001';
  try {
    console.log('Signup test...');
    let r = await axios.post(base + '/api/auth/signup', { email: 'test+1@example.com', password: 'hunter2', name: 'Test User' }, { withCredentials: true });
    console.log('signup status', r.status, r.data);

    console.log('Login test...');
    r = await axios.post(base + '/api/auth/login', { email: 'test+1@example.com', password: 'hunter2' }, { withCredentials: true });
    console.log('login status', r.status, r.data);

    console.log('Send OTP...');
    r = await axios.post(base + '/api/auth/otp/send', { email: 'test+1@example.com' }, { withCredentials: true });
    console.log('send otp', r.status, r.data);

    console.log('All tests done');
  } catch (err) {
    if (err.response) console.error('err', err.response.status, err.response.data);
    else console.error(err.message);
    process.exit(1);
  }
})();
