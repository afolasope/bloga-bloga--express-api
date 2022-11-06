const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId

const UserSchema = new Schema({
  id: ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minLength: [6, 'Password must be at least 6 characters'],
  },
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

});


UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});


UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
