const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userschema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  game: {
    type: String,
    // default: 'snake'
  },

});
module.exports = mongoose.model('User', userschema);
