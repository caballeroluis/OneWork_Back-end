const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(require('./config/config'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(require('./routes/index'));


mongoose.connect('mongodb://localhost:27017/OneWork', { useNewUrlParser: true }, (err, res) => {
  if( err ) throw err;
  console.log('Datebase is up!');
})

app.listen(process.env.PORT, () => console.log('Listening at port: ' + process.env.PORT))