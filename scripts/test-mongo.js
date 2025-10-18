/* Test script for MongoDB connection using mongoose
   - Loads .env if present
   - Uses MONGODB_URI or MONGODB_URL
   - Attempts to connect and prints success/failure (without echoing the URI)
*/

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load .env if exists (basic parsing)
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  env.forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) {
      const key = m[1];
      let val = m[2] || '';
      // remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URL;
if (!uri) {
  console.error('No MongoDB URI found in environment. Please set MONGODB_URI or MONGODB_URL in your .env or environment.');
  process.exit(2);
}

console.log('Attempting to connect to MongoDB...');

(async () => {
  try {
    // Use short timeout so tests fail fast when unreachable
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, family: 4 });
    console.log('MongoDB connection successful.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:', err && err.message ? err.message : err);
    // Provide non-sensitive troubleshooting hints
    console.error('\nHints:');
    console.error('- Ensure your connection string is correct and has username/password if required.');
    console.error('- If using MongoDB Atlas, make sure your IP is whitelisted or set to 0.0.0.0/0 for testing.');
    console.error('- Check network/firewall and DNS resolution.');
    process.exit(1);
  }
})();
