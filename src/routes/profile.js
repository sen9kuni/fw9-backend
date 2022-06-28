const profile = require('express').Router();

const profileControllers = require('../controllers/profile');

profile.get('/', profileControllers.getProfile);
profile.post('/', profileControllers.postProfile);
profile.put('/', profileControllers.putProfile);
profile.delete('/', profileControllers.deleteProfile);

module.exports = profile;