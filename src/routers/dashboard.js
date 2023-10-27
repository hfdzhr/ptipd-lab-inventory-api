const router = require('express').Router();
const { dashboard } = require('../controllers');

router.get('/', dashboard.getDashboardData); // Path untuk melihat

module.exports = router;
