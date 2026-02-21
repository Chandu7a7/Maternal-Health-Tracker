const jwt = require('jsonwebtoken');
const { getStore } = require('../store');

const secret = process.env.JWT_SECRET || 'maternal-health-secret';

const generateToken = (id) => jwt.sign({ id }, secret, { expiresIn: '30d' });

exports.register = async (req, res) => {
  try {
    const { User } = getStore();
    const { name, age, mobile, password, pregnancyMonth, familyContact, doctorContact } = req.body;
    console.log('[Auth] Register attempt:', { name, mobile, age, pregnancyMonth });
    if (!name || !mobile || !password) {
      return res.status(400).json({ message: 'Name, mobile and password are required' });
    }
    const existing = await User.findOne({ mobile });
    if (existing) {
      console.log('[Auth] Mobile already exists:', mobile);
      return res.status(400).json({ message: 'Mobile number already registered' });
    }
    const user = await User.create({
      name,
      age: age || 25,
      mobile,
      password,
      pregnancyMonth: pregnancyMonth || 1,
      familyContact: familyContact || '',
      doctorContact: doctorContact || '',
    });
    const token = generateToken(user._id);
    console.log('[Auth] Registration successful for:', mobile);
    res.status(201).json({ token, user: { id: user._id, name: user.name, mobile: user.mobile, pregnancyMonth: user.pregnancyMonth, age: user.age, familyContact: user.familyContact, doctorContact: user.doctorContact } });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { User } = getStore();
    const { mobile, password } = req.body;
    console.log('[Auth] Login attempt for mobile:', mobile);
    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }
    const user = await User.findOne({ mobile });
    if (!user) {
      console.log('[Auth] User not found:', mobile);
      return res.status(401).json({ message: 'Invalid mobile or password' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('[Auth] Password mismatch for:', mobile);
      return res.status(401).json({ message: 'Invalid mobile or password' });
    }
    const token = generateToken(user._id);
    console.log('[Auth] Login successful for:', mobile);
    res.json({ token, user: { id: user._id, name: user.name, mobile: user.mobile, pregnancyMonth: user.pregnancyMonth, age: user.age, familyContact: user.familyContact, doctorContact: user.doctorContact } });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const { User } = getStore();
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const u = user.toObject ? user.toObject() : user;
    delete u.password;
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { User } = getStore();
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updates = req.body;
    // Prevent sensitive fields from being updated here
    delete updates.password;
    delete updates._id;
    delete updates.mobile;

    Object.assign(user, updates);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
