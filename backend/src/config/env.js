require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  nodeEnv: process.env.NODE_ENV || 'development',
  protocol: process.env.PROTOCOL || 'http',
  pollingInterval: parseInt(process.env.POLLING_INTERVAL, 10) || 5000,
  sslCertPath: process.env.SSL_CERT_PATH,
  sslKeyPath: process.env.SSL_KEY_PATH,
};