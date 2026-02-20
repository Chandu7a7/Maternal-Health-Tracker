const User = require('../models/User');
const Symptom = require('../models/Symptom');
const Movement = require('../models/Movement');
const { MemoryUser, MemorySymptom, MemoryMovement } = require('./memoryStore');

function getStore() {
  if (global.USE_MEMORY_STORE) {
    return { User: MemoryUser, Symptom: MemorySymptom, Movement: MemoryMovement };
  }
  return { User, Symptom, Movement };
}

module.exports = { getStore };
