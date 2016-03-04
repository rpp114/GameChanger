var userController = {};
var bcrypt = require('bcryptjs');
var path = require('path');
// var sessionController = require('./sessionController');
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

});
User = mongoose.model('User', userschema);

userController.createUser = function(req, res) {
  if(req.body.password === req.body.password2) {
    User.create(req.body, function(err, data) {
      if (err) {
        // throw err
        console.log(err)
        return res.status(500).send('showAlert');
      }
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(data.password, salt);
      data.password = hash;
      res.cookie('SSID', data.id);
      // sessionController.startSession(req, res, data._id);
      data.save();

      return res.sendFile(path.join(__dirname, '../controller/controller.html'));
    });
  } else {
    return res.send('Please make sure your password matches');
  }
};

userController.verify = function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, doc) {
    if (doc) {
      if (bcrypt.compareSync(req.body.password, doc.password)) {
        res.cookie('SSID', doc.id);
        // sessionController.startSession(req, res, doc._id);
        res.redirect('/controller?id=' + doc.id)
        return res.sendFile(path.join(__dirname, '../controller/controller.html'));
      }
      // console.log('bye')
      return res.send('error: ', err);
    }
    return res.send('error: ', err);

  });

};


module.exports = userController;
