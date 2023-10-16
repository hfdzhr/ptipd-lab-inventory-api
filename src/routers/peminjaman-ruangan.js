const router = require('express').Router();
const { peminjamanRuangan } = require('../controllers');

router.get('/', peminjamanRuangan.getDataPeminjamanRuangan); // Path untuk melihat

router.get('/:id', peminjamanRuangan.getSingleDataPeminjamanRuangan); // Path untuk melihat

router.post('/', peminjamanRuangan.addDataPeminjamanRuangan); // Path untuk menambah data

router.put('/:id', peminjamanRuangan.editDataPeminjamanRuangan) // Path untuk edit data

router.delete('/:id', peminjamanRuangan.deleteDataPeminjamanRuangan) // Path untuk hapus data
module.exports = router;
