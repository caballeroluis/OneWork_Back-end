const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/env.config');

// const { globalLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();

app.use(require('./config/cors.config'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true }, (error, res) => {
  if( error ) throw error;
  console.log('Datebase is up!');
})

app.use(express.json({ limit: 10 }));
// app.use(globalLimiter);

app.use('/api/users', require('./routes/user.route'));
app.use('/api/session', require('./routes/session.route'));
app.use('/api/uploads', require('./routes/upload.route'));
app.use('/api/offers', require('./routes/offer.route'));
app.use('/api/admin', require('./routes/admin.route'));
app.get('/*', function(req, res){res.send('')});

app.use(require('./middlewares/errorsHandler.middleware'));


app.listen(config.PORT, () => console.log('Listening at port: ' + config.PORT));