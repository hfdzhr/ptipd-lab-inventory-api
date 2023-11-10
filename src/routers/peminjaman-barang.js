const router = require('express').Router();
const { peminjamanBarang } = require('../controllers');

router.get('/', peminjamanBarang.getDataPeminjamanBarang); // Path untuk melihat

router.get('/data', peminjamanBarang.getDataUntukDiPinjam); // Path untuk melihat

router.get('/:id', peminjamanBarang.getSingleDataPeminjamanBarang); // Path untuk melihat

router.post('/', peminjamanBarang.addDataPeminjamanBarang); // Path untuk menambah data

router.put('/:id', peminjamanBarang.editDataPeminjamanBarang) // Path untuk edit data

router.delete('/:id', peminjamanBarang.deleteDataPeminjamanBarang) // Path untuk hapus data
module.exports = router;
