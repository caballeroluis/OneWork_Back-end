const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/env.config');
const cors = require('./config/cors.config');
const socketRoutes = require('./sockets/index');
// const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const app = express();

app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: 10 }));
// app.use(globalLimiter);

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true }, (error, res) => {
  if( error ) throw error;
  console.log('Datebase is up!');
});
const server = app.listen(config.PORT, () => console.log('Listening at port: ' + config.PORT));
const io = require('socket.io')(server);
socketRoutes(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api/users', require('./routes/user.route'));
app.use('/api/session', require('./routes/session.route'));
app.use('/api/uploads', require('./routes/upload.route'));
app.use('/api/offers', require('./routes/offer.route'));
app.use('/api/admin', require('./routes/admin.route'));
app.get('/*', function(req, res){res.send('')});

app.use(require('./middlewares/errorsHandler.middleware'));


