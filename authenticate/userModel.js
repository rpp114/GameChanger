var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userschema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  game: {
    type: String,
    default: 'snake'
  }

});
module.exports = mongoose.model('User', userschema);
