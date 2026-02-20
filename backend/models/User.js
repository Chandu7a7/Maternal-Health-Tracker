const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 25 },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pregnancyMonth: { type: Number, default: 1 },
  familyContact: { type: String, default: '' },
  doctorContact: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
