const router = require('express').Router();
const { barangPendukung } = require('../controllers');

router.get('/', barangPendukung.getDataBarangPendukung); // Path untuk melihat

router.get('/:id', barangPendukung.getSingleDataBarangPendukung); // Path untuk melihat

router.post('/', barangPendukung.addDataBarangPendukung); // Path untuk menambah data

router.put('/:id', barangPendukung.editDataBarangPendukung) // Path untuk edit data

router.delete('/:id', barangPendukung.deleteDataBarangPendukung) // Path untuk hapus data
module.exports = router;
