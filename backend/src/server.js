const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/env');

const trendsRouter = require('./api/trends');
const { job } = require('./jobs/collectionJob');

const app = express();

app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "upgrade-insecure-requests": null,
    },
  },
  hsts: false,
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes will be mounted here
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/trends', trendsRouter);
app.use('/api/newsletters', require('./api/newsletters'));
app.use('/api/subscribers', require('./api/subscribers'));
app.use('/api/sources', require('./api/sources'));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use(errorHandler);

// Anything that doesn't match the above, send back index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Start Cron Job
if (process.env.NODE_ENV !== 'test') {
  job.start();
}

if (require.main === module) {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '../certs/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem'))
  };

  https.createServer(httpsOptions, app).listen(config.port, () => {
    console.log(`Server running on port ${config.port} (HTTPS)`);
  });
}

module.exports = app;
