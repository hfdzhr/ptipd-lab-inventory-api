const router = require('express').Router();
const cors = require('cors')
const routerUsers = require('./users');
const routerRuangan = require('./ruangan');
const routerPeminjamanRuangan = require('./peminjaman-ruangan');
const routerMerk = require('./merk');
const routerTipeBarang = require('./tipe-barang');
const routerKomputer = require('./komputer');
const routerBarangPendukung = require('./barang-pendukung.js')

// PATH untuk data users
router.use(cors())

router.use('/users', routerUsers);

router.use('/ruangan', routerRuangan);

router.use('/peminjaman-ruangan', routerPeminjamanRuangan);

router.use('/merk', routerMerk);

router.use('/tipe-barang', routerTipeBarang);

router.use('/komputer', routerKomputer);

router.use('/barang-pendukung', routerBarangPendukung);

router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Selamat Datang Di API Lab Inventaris PTIPD',
  });
});

module.exports = router;
