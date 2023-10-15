const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataPeminjamanRuangan = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    connection.query(
      'SELECT peminjaman_ruangan.id, ruangan.nama_ruangan, peminjaman_ruangan.kegiatan, peminjaman_ruangan.tanggal_peminjaman, peminjaman_ruangan.tanggal_kembali, peminjaman_ruangan.status_peminjaman FROM peminjaman_ruangan JOIN ruangan ON id_ruangan=ruangan.id',
      function (error, rows) {
        if (rows) {
          resolve(rows);
        } else {
          reject([]);
        }
      }
    );
  });

  if (data) {
    res.send({
      code: 200,
      status: 'OK',
      data: data,
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
    });
  }
};

// Menambahkan data produk
const addDataPeminjamanRuangan = async (req, res) => {
  let dataPeminjamanRuangan = {
    id_ruangan: req.body.id_ruangan,
    kegiatan: req.body.kegiatan,
    tanggal_peminjaman: req.body.tanggal_peminjaman,
    tanggal_kembali: req.body.tanggal_kembali,
    status_peminjaman: req.body.status_peminjaman,
  };

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO peminjaman_ruangan SET ?;',
      [dataPeminjamanRuangan],
      function (error, rows) {
        if (rows) {
          resolve(true);
        } else {
          reject(false);
        }
      }
    );
  });

  if (result) {
    res.send({
      code: 200,
      status: 'OK',
      data: dataPeminjamanRuangan,
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        id_ruangan: [
          'Tidak boleh kosong',
          'Tidak boleh berisikan data null',
          'Cek Kembali id',
        ],
        kegiatan: ['Tidak boleh kosong', 'Tidak boleh berisikan data null'],
        tanggal_peminjaman: [
          'Tidak boleh kosong',
          'Tidak boleh berisikan data null',
          'Gunakan format tanggal YYYY/MM/DD',
        ],
        tanggal_kembali: [
          'Tidak boleh kosong',
          'Tidak boleh berisikan data null',
          'Gunakan format tanggal YYYY/MM/DD',
        ],
        status_peminjaman: [
          'Tidak boleh kosong',
          'Tidak boleh berisikan data null',
          'Gunakan tipe data string',
        ],
      },
    });
  }
};

// Mengubah data
const editDataPeminjamanRuangan = async (req, res) => {
  let id = req.params.id;
  let dataPeminjamanRuanganEdit = {
    id_ruangan: req.body.id_ruangan,
    kegiatan: req.body.kegiatan,
    tanggal_peminjaman: req.body.tanggal_peminjaman,
    tanggal_kembali: req.body.tanggal_kembali,
    status_peminjaman: req.body.status_peminjaman,
  };

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'UPDATE peminjaman_ruangan SET ? WHERE id = ?;',
      [dataPeminjamanRuanganEdit, id],
      function (error, rows) {
        if (rows) {
          resolve(true);
        } else {
          reject(false);
        }
      }
    );
  });

  if (result) {
    res.send({
      code: 200,
      status: 'OK',
      data: {
        id: id,
        ...dataPeminjamanRuanganEdit,
      },
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        id_ruangan: [
          'Tidak boleh kosong',
          'Tidak boleh berisikan data null',
          'Cek Kembali id',
        ],
        kegiatan: ['Tidak boleh kosong', 'Tidak boleh berisikan data null'],
        tanggal_peminjaman: [
          'Tidak boleh kosong',
          'Tidak boleh berisikan data null',
          'Gunakan format tanggal YYYY/MM/DD',
        ],
        tanggal_kembali: [
          'Tidak boleh kosong',
          'Tidak boleh berisikan data null',
          'Gunakan format tanggal YYYY/MM/DD',
        ],
        status_peminjaman: [
          'Tidak boleh kosong',
          'Tidak boleh berisikan data null',
          'Gunakan tipe data string',
        ],
      },
    });
  }
};

// Delete Data Produk
const deleteDataPeminjamanRuangan = async (req, res) => {
  let id = req.params.id;

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM peminjaman_ruangan WHERE id = ?;',
      [id],
      function (error, rows) {
        if (rows) {
          resolve(true);
        } else {
          reject(false);
        }
      }
    );
  });

  if (result) {
    res.send({
      code: 200,
      status: 'OK',
      deleted_data_id: id,
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        id: [
          'Gunakan tipe data integer',
          'Cek kembali nomor id',
          'Gunakan id yang sesuai',
          'Berisikan 4 digit',
          'Tidak boleh kosong',
          'Tidak boleh berisi data null',
          'Cek kembeli parameter',
        ],
      },
    });
  }
};

module.exports = {
  getDataPeminjamanRuangan,
  addDataPeminjamanRuangan,
  editDataPeminjamanRuangan,
  deleteDataPeminjamanRuangan,
};
