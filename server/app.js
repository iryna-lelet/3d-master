const express = require('express');
const ErrorHandler = require('./utils/ErrorHandler');
const HttpError = require('./utils/HttpError');
const bodyParser = require('body-parser');
const { join } = require('path');

const app = express();

app.set('port', (process.env.PORT || 3000));

const api = require('./api');

app.use(bodyParser.json({ limit: '10mb' }));

app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

app.use('/api', api);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'index.html'));
});

app.use((req, res, next) => {
  next(new HttpError(404, 'Not Found'));
});

app.use(ErrorHandler);

app.listen(app.get('port'), () => {
  console.log('Running on port', app.get('port'));
});