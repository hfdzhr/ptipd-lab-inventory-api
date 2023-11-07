const router = require('express').Router();
const { users } = require('../controllers');

router.get('/verify/:token', users.VerifyUser); // Path untuk verifikasi data

router.get('/', users.getDataUsers); // Menampilkan semua data user

router.post('/register', users.registerDataUser); // Path untuk registrasi data

router.post('/login', users.loginDataUser) // Path untuk login data user

router.put('/:id', users.editDataUsers); // Mengedit data users
 
router.put('/reset-password/:id', users.resetPasswordUsers) // Reset Password Users

router.delete('/:id', users.deleteDataUsers) // Menghapus data user


module.exports = router;
