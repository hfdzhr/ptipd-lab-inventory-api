const router = require('express').Router();
const { perbaikanKomputer } = require('../controllers');

router.get('/', perbaikanKomputer.getDataPerbaikanKomputer); // Path untuk melihat

router.get('/:id', perbaikanKomputer.getSingleDataPerbaikanKomputer); // Path untuk melihat

router.post('/', perbaikanKomputer.addDataPerbaikanKomputer); // Path untuk menambah data

router.put('/:id', perbaikanKomputer.editDataPerbaikanKomputer) // Path untuk edit data

router.delete('/:id', perbaikanKomputer.deleteDataPerbaikanKomputer) // Path untuk hapus data

module.exports = router;
