const bcrypt = require('bcryptjs');

const users = new Map();
const symptoms = [];
const movements = [];
let userIdCounter = 1;
let symptomIdCounter = 1;
let movementIdCounter = 1;

function chainPromise(value) {
  const p = Promise.resolve(value);
  p.sort = p.limit = p.select = () => p;
  p.lean = () => p;
  return p;
}

const MemoryUser = {
  async findOne(query) {
    if (query.mobile) {
      const u = [...users.values()].find((u) => u.mobile === query.mobile) || null;
      if (u) u.matchPassword = (plain) => bcrypt.compare(plain, u.password);
      return u;
    }
    return null;
  },
  async findById(id) {
    const u = users.get(String(id)) || null;
    if (u) {
      const { password, ...rest } = u;
      return { ...rest, matchPassword: () => {} };
    }
    return null;
  },
  async create(data) {
    const id = String(userIdCounter++);
    const hashed = await bcrypt.hash(data.password, 10);
    const user = {
      _id: id,
      name: data.name,
      age: data.age || 25,
      mobile: data.mobile,
      password: hashed,
      pregnancyMonth: data.pregnancyMonth || 1,
      familyContact: data.familyContact || '',
      doctorContact: data.doctorContact || '',
    };
    users.set(id, user);
    return user;
  },
};

const MemorySymptom = {
  async create(data) {
    const doc = {
      _id: String(symptomIdCounter++),
      user: data.user,
      symptom: data.symptom,
      risk: data.risk || 'Safe',
      advice: data.advice || '',
      createdAt: new Date(),
    };
    symptoms.unshift(doc);
    return doc;
  },
  find(query) {
    const filtered = symptoms.filter((s) => String(s.user) === String(query.user));
    return chainPromise(filtered);
  },
  findOne(query) {
    const filtered = symptoms.filter((s) => String(s.user) === String(query.user));
    return chainPromise(filtered[0] || null);
  },
};

const MemoryMovement = {
  async create(data) {
    const doc = {
      _id: String(movementIdCounter++),
      user: data.user,
      hasMovement: data.hasMovement,
      count: data.count ?? 0,
      date: new Date(),
    };
    movements.unshift(doc);
    return doc;
  },
  find(query) {
    let filtered = movements.filter((m) => String(m.user) === String(query.user));
    if (query.date) {
      const dayStart = new Date(query.date.$gte);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      filtered = filtered.filter((m) => new Date(m.date) >= dayStart && new Date(m.date) < dayEnd);
    }
    return chainPromise(filtered);
  },
  findOne(query) {
    const dayStart = new Date(query.date.$gte);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const m = movements.find(
      (x) => String(x.user) === String(query.user) && new Date(x.date) >= dayStart && new Date(x.date) < dayEnd
    );
    return chainPromise(m || null);
  },
};

module.exports = { MemoryUser, MemorySymptom, MemoryMovement };
