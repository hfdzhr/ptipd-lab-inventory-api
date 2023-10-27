const router = require('express').Router();
const cors = require('cors')
const routerUsers = require('./users');
const routerRuangan = require('./ruangan');
const routerPeminjamanRuangan = require('./peminjaman-ruangan');
const routerMerk = require('./merk');
const routerTipeBarang = require('./tipe-barang');
const routerKomputer = require('./komputer');
const routerBarangPendukung = require('./barang-pendukung.js');
const routerDashboard = require('./dashboard')
const routerPeminjamanBarang = require('./peminjaman-barang')
const { checkRole } = require('../controllers/controller-users');

// PATH untuk data users
router.use(cors())

router.use('/users', routerUsers);

router.use('/ruangan' ,checkRole('admin'), routerRuangan);

router.use('/peminjaman-ruangan', routerPeminjamanRuangan);

router.use('/merk', routerMerk);

router.use('/tipe-barang', routerTipeBarang);

router.use('/komputer', routerKomputer);

router.use('/barang-pendukung', routerBarangPendukung);

router.use('/dashboard', routerDashboard);

router.use('/peminjaman-barang', routerPeminjamanBarang)

router.get('/test', checkRole('user'), (req,res) => {
  res.json({msg: 'Hanya admin yang dapat mengakses ini'})
})

router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Selamat Datang Di API Lab Inventaris PTIPD',
  });
});

module.exports = router;
