require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  nodeEnv: process.env.NODE_ENV || 'development',
  sslCertPath: process.env.SSL_CERT_PATH,
  sslKeyPath: process.env.SSL_KEY_PATH,
};