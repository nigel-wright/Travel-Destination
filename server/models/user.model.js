const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
  }
);

module.exports = mongoose.model('User', UserSchema);