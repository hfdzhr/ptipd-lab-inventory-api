const router = require('express').Router();
const routerUsers = require('./users');

// PATH untuk data users
router.use('/users', routerUsers);

module.exports = router;
