const router = require('express').Router();
const routerUsers = require('./users');

// PATH untuk data users
router.use('/users', routerUsers);

router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Selamat Datang Di API Lab Inventaris PTIPD'
  })
});

module.exports = router;
