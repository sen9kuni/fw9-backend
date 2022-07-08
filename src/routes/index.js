const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/profile', require('./profile'));
router.use('/transactions', require('./transactions'));
router.use('/transactiontype', require('./transactiontype'));
router.use('/auth', require('./auth'));

module.exports = router;