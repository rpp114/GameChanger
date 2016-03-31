var mongoose = require('mongoose');
var User   = require('./userModel');
var Session = require('./sessionModel')
var sessionController = {};


sessionController.isLoggedIn = function(req, res) {
  if(req.cookies.SSID) {
    return Session.findOne({cookieId: req.cookies.SSID}, function(err, doc) {
      if(doc) return true;
      else return false;
    });
  }
};

sessionController.startSession = function(req, res, next) {
  // create session
  var obj = {};

  User.findOne({userName: req.body.userName}, function (err, doc) {
    obj.cookieId = doc.id;

    Session.create(obj);
  });

};

module.exports = sessionController;
