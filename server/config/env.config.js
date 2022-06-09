const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  SECRET: process.env.SECRET || 'dwa',
  SECRET_REFRESH: process.env.SECRET_REFRESH || 'dwas',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'dev',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/OneWork',
  TOKEN_SALT: parseInt(process.env.TOKEN_SALT, 10) || 10 
}