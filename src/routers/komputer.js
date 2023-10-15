const router = require('express').Router();
const { komputer } = require('../controllers');

router.get('/', komputer.getDataKomputer); // Path untuk melihat

router.post('/', komputer.addDataKomputer); // Path untuk menambah data

router.put('/:id', komputer.editDataKomputer) // Path untuk edit data

router.delete('/:id', komputer.deleteDataKomputer) // Path untuk hapus data
module.exports = router;
