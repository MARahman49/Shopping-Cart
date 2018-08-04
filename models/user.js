var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_FACTOR = 10;

var Schema = mongoose.Schema;

var UserSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

var noop = function() {};
UserSchema.pre("save", function(done) {
  var user = this;
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

UserSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

UserSchema.methods.name = function() {
  return this.displayName || this.username;
};

var User = mongoose.model('User', UserSchema);
module.exports = User;