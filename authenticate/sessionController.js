const User = require('./userModel');
const Session = require('./sessionModel');
const sessionController = {};


sessionController.isLoggedIn = (req) => {
  if (req.cookies.SSID) {
    return Session.findOne({ cookieId: req.cookies.SSID }, (err, doc) => {
      if (doc) return true;
      return false;
    });
  }
  return false;
};

sessionController.startSession = (req) => {
  const obj = {};
  User.findOne({ userName: req.body.userName }, (err, doc) => {
    obj.cookieId = doc.id;
    Session.create(obj);
  });
};

module.exports = sessionController;
