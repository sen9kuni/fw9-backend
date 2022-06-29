const profile = require('express').Router();

const profileControllers = require('../controllers/profile');

profile.get('/', profileControllers.getAllProfile);
profile.get('/:id', profileControllers.seacrhProfileById);
profile.post('/', profileControllers.createProfile);
profile.patch('/:id', profileControllers.editProfile);
profile.delete('/:id', profileControllers.deleteProfile);

module.exports = profile;