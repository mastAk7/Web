require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/db/connect');

const PORT = Number(process.env.PORT) || 8080;        // Railway injects PORT
const MONGODB_URI = process.env.MONGODB_URI;          // make sure this is set

(async () => {
  try {
    if (MONGODB_URI) {
      await connectDB(MONGODB_URI);
    }

    // IMPORTANT: bind to 0.0.0.0 on Railway
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API listening on http://0.0.0.0:${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();
