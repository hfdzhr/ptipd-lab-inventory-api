const router = require('express').Router();
const { merk } = require('../controllers');

router.get('/', merk.getDataMerk); // Path untuk melihat

router.get('/:id', merk.getSingleDataMerk); // Path untuk melihat

router.post('/', merk.addDataMerk); // Path untuk menambah data

router.put('/:id', merk.editDataMerk) // Path untuk edit data

router.delete('/:id', merk.deleteDataMerk) // Path untuk hapus data
module.exports = router;
