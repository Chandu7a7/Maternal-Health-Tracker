require('dotenv').config();
const os = require('os');
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return '127.0.0.1';
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      const ip = getLocalIP();
      console.log(`\nServer running on port ${PORT}`);
      console.log(`Local:   http://localhost:${PORT}`);
      console.log(`Network: http://${ip}:${PORT}`);
      console.log(`\nApp API: http://${ip}:${PORT}/api\n`);
    });
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
