const router = require('express').Router();
const { ruangan } = require('../controllers');

router.get('/', ruangan.getDataRuangan); // Path untuk melihat

router.post('/', ruangan.addDataRuangan); // Path untuk menambah data

router.put('/:id', ruangan.editDataRuangan) // Path untuk edit data

router.delete('/:id', ruangan.deleteDataRuangan) // Path untuk hapus data
module.exports = router;
