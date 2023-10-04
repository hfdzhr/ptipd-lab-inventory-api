const router = require('express').Router();
const routerUsers = require('./users');

// PATH untuk data users
router.use('/users', routerUsers);

router.get('/', (req, res) => {
  res.send('Express JS');
});

module.exports = router;
