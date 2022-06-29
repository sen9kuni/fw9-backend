const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/profile', require('./profile'));
router.use('/transactions', require('./transactions'));
router.use('/transactiontype', require('./transactiontype'));

module.exports = router;