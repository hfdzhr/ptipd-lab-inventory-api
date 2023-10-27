const users = require('./controller-users');
const ruangan = require('./controller-ruangan');
const peminjamanRuangan = require('./controller-peminjaman-ruangan');
const merk = require('./controller-merk');
const tipeBarang = require('./controller-tipe-barang');
const komputer = require('./controller-komputer');
const barangPendukung = require('./controller-barang-pendukung')
const dashboard = require('./controller-dashboard')
const peminjamanBarang = require('./controller-peminjaman-barang')

module.exports = {
  users,
  ruangan,
  peminjamanRuangan,
  merk,
  tipeBarang,
  komputer,
  barangPendukung,
  dashboard,
  peminjamanBarang
};
