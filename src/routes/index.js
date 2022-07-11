const router = require('express').Router();

router.use('/admin/users', require('./users'));
router.use('/admin/profile', require('./profile'));
router.use('/admin/transactions', require('./transactions'));
router.use('/admin/transactiontype', require('./transactiontype'));
router.use('/admin/auth', require('./auth'));
router.use('/admin/authenticated', require('./authenticated'));

module.exports = router;