const router = require('express').Router();
const { tipeBarang } = require('../controllers');

router.get('/', tipeBarang.getDataTipeBarang); // Path untuk melihat

router.get('/:id', tipeBarang.getSingleDataTipeBarang); // Path untuk melihat

router.post('/', tipeBarang.addDataTipeBarang); // Path untuk menambah data

router.put('/:id', tipeBarang.editDataTipeBarang) // Path untuk edit data

router.delete('/:id', tipeBarang.deleteDataTipeBarang) // Path untuk hapus data
module.exports = router;
