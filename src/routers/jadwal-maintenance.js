const router = require('express').Router();
const { jadwalMaintenance } = require('../controllers');

router.get('/', jadwalMaintenance.getDataJadwalMaintenance); // Path untuk melihat

router.get('/:id', jadwalMaintenance.getSingleDataJadwalMaintenance); // Path untuk melihat

router.post('/', jadwalMaintenance.addDataJadwalMaintenance); // Path untuk menambah data

router.put('/:id', jadwalMaintenance.editDataJadwalMaintenance) // Path untuk edit data

router.delete('/:id', jadwalMaintenance.deleteDataJadwalMaintenance) // Path untuk hapus data

module.exports = router;
