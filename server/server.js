const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(require('./config/config'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/OneWork', { useNewUrlParser: true }, (err, res) => {
  if( err ) throw err;
  console.log('Datebase is up!');
})

app.use('/api/users', require('./routes/user'));
app.use('/api/login', require('./routes/login'));
app.use('/api/uploads', require('./routes/upload'));
app.use('/api/offers', require('./routes/offer'));

app.use(require('./middlewares/errorsMiddleware'));

app.listen(process.env.PORT, () => console.log('Listening at port: ' + process.env.PORT))