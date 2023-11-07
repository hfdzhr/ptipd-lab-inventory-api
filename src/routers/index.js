const router = require('express').Router();
const cors = require('cors');
const routerUsers = require('./users');
const routerRuangan = require('./ruangan');
const routerPeminjamanRuangan = require('./peminjaman-ruangan');
const routerMerk = require('./merk');
const routerTipeBarang = require('./tipe-barang');
const routerKomputer = require('./komputer');
const routerBarangPendukung = require('./barang-pendukung.js');
const routerDashboard = require('./dashboard');
const routerPeminjamanBarang = require('./peminjaman-barang');
const routerJadwalMaintenance = require('./jadwal-maintenance');
const routerPerbaikanKomputer = require('./perbaikan-komputer');
const { checkRole } = require('../controllers/controller-users');

// PATH untuk data users
router.use(cors());

router.use('/users', routerUsers);

router.use('/ruangan', checkRole('admin'), routerRuangan);

router.use(
  '/peminjaman-ruangan',
  checkRole('admin'),
  routerPeminjamanRuangan
);

router.use('/merk', checkRole('admin'), routerMerk);

router.use('/tipe-barang', checkRole('admin'), routerTipeBarang);

router.use('/komputer', checkRole('admin'), routerKomputer);

router.use('/barang-pendukung', checkRole('admin'), routerBarangPendukung);

router.use('/dashboard',checkRole('admin'), routerDashboard);

router.use('/peminjaman-barang', checkRole('admin'), routerPeminjamanBarang);

router.use('/jadwal-maintenance', checkRole('admin'), routerJadwalMaintenance);

router.use('/perbaikan-komputer', checkRole('admin'), routerPerbaikanKomputer);

router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Selamat Datang Di API Lab Inventaris PTIPD',
  });
});

module.exports = router;
