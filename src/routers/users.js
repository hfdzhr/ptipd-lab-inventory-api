const router = require('express').Router();
const { users } = require('../controllers');

router.get('/verify/:token', users.VerifyUser); // Path untuk verifikasi data

router.post('/register', users.registerDataUser); // Path untuk registrasi data

router.post('/login', users.loginDataUser) // Path untuk login data user
module.exports = router;
