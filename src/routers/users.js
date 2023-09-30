const router = require('express').Router();
const { users } = require('../controllers');

router.get('/verify/:token', users.VerifyUser);

router.post('/register', users.registerDataUser);

module.exports = router;
