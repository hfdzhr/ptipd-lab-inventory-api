const users = require('./controller-users');
const ruangan = require('./controller-ruangan');
const peminjamanRuangan = require('./controller-peminjaman-ruangan');
const merk = require('./controller-merk');
const tipeBarang = require('./controller-tipe-barang');
const komputer = require('./controller-komputer');
const barangPendukung = require('./controller-barang-pendukung')

module.exports = {
  users,
  ruangan,
  peminjamanRuangan,
  merk,
  tipeBarang,
  komputer,
  barangPendukung
};
