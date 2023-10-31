const db = require('../configs/db.config');

// Menampilkan semua data
const getDataPeminjamanBarang = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        'SELECT peminjaman_barang.id, barang_pendukung.nama_barang, peminjaman_barang.tgl_peminjaman, peminjaman_barang.tgl_kembali, peminjaman_barang.status_peminjaman, peminjaman_barang.peminjam, peminjaman_barang.created_at, peminjaman_barang.updated_at FROM peminjaman_barang JOIN barang_pendukung ON id_barang_pendukung = barang_pendukung.id;',
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });

    if (data) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: data,
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
      });
    }
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: error.message,
    });
  }
};

const getSingleDataPeminjamanBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      db.query(
        'SELECT peminjaman_barang.id, barang_pendukung.nama_barang, peminjaman_barang.tgl_peminjaman, peminjaman_barang.tgl_kembali, peminjaman_barang.status_peminjaman, peminjaman_barang.peminjam, peminjaman_barang.created_at, peminjaman_barang.updated_at FROM peminjaman_barang JOIN barang_pendukung ON id_barang_pendukung = barang_pendukung.id WHERE peminjaman_barang.id = ?;',
        [id],
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });

    if (data.length !== 0) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: data[0],
      });
    } else if (data.length === 0) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        message: 'Data yang dicari tidak ditemukan',
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        error: {
          id: ['Silahkan cek kembali id'],
        },
      });
    }
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: error.message,
    });
  }
};

// Menambahkan data produk
const addDataPeminjamanBarang = async (req, res) => {
  try {
    let dataPeminjamanBarang = {
      id_barang_pendukung: parseInt(req.body.id_barang_pendukung),
      tgl_peminjaman: req.body.tgl_peminjaman,
      tgl_kembali: req.body.tgl_kembali,
      status_peminjaman: req.body.status_peminjaman,
      peminjam: req.body.peminjam,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO peminjaman_barang SET ?;',
        [dataPeminjamanBarang],
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        }
      );
    });

    if (result) {
      res.status(201).send({
        code: 201,
        status: 'CREATED',
        data: dataPeminjamanBarang,
      });
    } else {
      res.status(400).send({
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
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: error.message,
    });
  }
};

// Mengubah data
const editDataPeminjamanBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let editDataPeminjamanBarang = {
      id_barang_pendukung: parseInt(req.body.id_barang_pendukung),
      tgl_peminjaman: req.body.tgl_peminjaman,
      tgl_kembali: req.body.tgl_kembali,
      status_peminjaman: req.body.status_peminjaman,
      peminjam: req.body.peminjam,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE peminjaman_barang SET ? WHERE id = ?;',
        [editDataPeminjamanBarang, id],
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        }
      );
    });

    if (result) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: {
          id: id,
          ...editDataPeminjamanBarang,
        },
      });
      res.status(400).send({
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
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: error.message,
    });
  }
};

// Delete Data Produk
const deleteDataPeminjamanBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM peminjaman_barang WHERE id = ?;',
        [id],
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        }
      );
    });

    if (result) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        deleted_data_id: id,
      });
    } else {
      res.status(400).send({
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
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: error.message,
    });
  }
};

module.exports = {
  getDataPeminjamanBarang,
  getSingleDataPeminjamanBarang,
  addDataPeminjamanBarang,
  editDataPeminjamanBarang,
  deleteDataPeminjamanBarang,
};
