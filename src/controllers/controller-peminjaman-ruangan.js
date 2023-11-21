const db = require('../configs/db.config');
const fs = require('fs');
const randomstring = require('randomstring');
// Menampilkan semua data
const getDataPeminjamanRuangan = async (req, res) => {
  try {
    const tanggalPeminjaman = req.query.tglpeminjaman || '';
    const search = req.query.search_query || '';

    const namaPeminjam = req.query.namapeminjam || '';
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const totalRows = await new Promise((resolve, reject) => {
      let queryCountPeminjamanRuangan =
        'SELECT COUNT(*) FROM peminjaman_ruangan ';

      db.query(queryCountPeminjamanRuangan, function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows[0]['COUNT(*)']);
        }
      });
    });

    const data = await new Promise((resolve, reject) => {
      let queryPeminjamanRuangan = `SELECT
      peminjaman_ruangan.id,
      peminjaman_ruangan.nama_peminjam,
      peminjaman_ruangan.id_ruangan,
      ruangan.nama_ruangan,
      peminjaman_ruangan.kegiatan,
      peminjaman_ruangan.jenis_kegiatan,
      peminjaman_ruangan.instansi,
      peminjaman_ruangan.tanggal_peminjaman,
      peminjaman_ruangan.tanggal_kembali,
      peminjaman_ruangan.status_peminjaman,
      peminjaman_ruangan.nama_file,
      peminjaman_ruangan.file,
      peminjaman_ruangan.created_at,
      peminjaman_ruangan.updated_at
    FROM
      peminjaman_ruangan
    JOIN ruangan ON
      id_ruangan = ruangan.id
    WHERE ruangan.nama_ruangan LIKE ? OR peminjaman_ruangan.nama_peminjam  LIKE ? OR peminjaman_ruangan.kegiatan LIKE ? OR peminjaman_ruangan.jenis_kegiatan LIKE ?`;

      db.query(
        queryPeminjamanRuangan,
        [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
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

const getSingleDataPeminjamanRuangan = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      db.query(
        'SELECT peminjaman_ruangan.id, peminjaman_ruangan.nama_peminjam, peminjaman_ruangan.id_ruangan, ruangan.nama_ruangan, peminjaman_ruangan.kegiatan, peminjaman_ruangan.jenis_kegiatan, peminjaman_ruangan.instansi, peminjaman_ruangan.tanggal_peminjaman, peminjaman_ruangan.tanggal_kembali, peminjaman_ruangan.status_peminjaman, peminjaman_ruangan.created_at, peminjaman_ruangan.updated_at FROM peminjaman_ruangan JOIN ruangan ON id_ruangan = ruangan.id WHERE peminjaman_ruangan.id = ?',
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
        message: 'Data yang anda cari tidak ada',
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
const addDataPeminjamanRuangan = async (req, res) => {
  try {
    let url = null;
    let fileName = null;
    if (req.files && req.files.file) {
      const file = req.files.file;
      fileName = `${randomstring.generate(8)}-${file.name}`;
      url = `${req.protocol}://${req.get('host')}/dokumen/${fileName}`;

      file.mv(`./public/dokumen/${fileName}`, async (err) => {
        if (err) {
          throw new Error('Gagal menyimpan file');
        }
      });
    }

    let dataPeminjamanRuangan = {
      nama_peminjam: req.body.nama_peminjam,
      id_ruangan: parseInt(req.body.id_ruangan),
      kegiatan: req.body.kegiatan,
      instansi: req.body.instansi,
      jenis_kegiatan: req.body.jenis_kegiatan,
      tanggal_peminjaman: req.body.tanggal_peminjaman,
      tanggal_kembali: req.body.tanggal_kembali,
      status_peminjaman: req.body.status_peminjaman,
      nama_file: fileName,
      file: url, // Gunakan nilai URL atau null sesuai kondisi
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO peminjaman_ruangan SET ?;',
        [dataPeminjamanRuangan],
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
        data: dataPeminjamanRuangan,
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
const editDataPeminjamanRuangan = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const ruangan = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM peminjaman_ruangan WHERE id = ?',
        [id],
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(rows[0]); // Ambil data pertama dari hasil query
          }
        }
      );
    });

    let url = null;
    let fileName = null;

    if (req.files && req.files.file) {
      const file = req.files.file;
      fileName = `${randomstring.generate(8)}-${file.name}`;
      url = `${req.protocol}://${req.get('host')}/dokumen/${fileName}`;

      const filepath = `./public/dokumen/${ruangan.nama_file}`;
      if (ruangan.nama_file) {
        fs.unlinkSync(filepath); // Hapus file hanya jika nama_file tersedia
      }

      await new Promise((resolve, reject) => {
        file.mv(`./public/dokumen/${fileName}`, (err) => {
          if (err) {
            reject(new Error('Gagal menyimpan file'));
          } else {
            resolve();
          }
        });
      });
    }

    const dataPeminjamanRuanganEdit = {
      nama_peminjam: req.body.nama_peminjam,
      id_ruangan: parseInt(req.body.id_ruangan),
      kegiatan: req.body.kegiatan,
      instansi: req.body.instansi,
      jenis_kegiatan: req.body.jenis_kegiatan,
      tanggal_peminjaman: req.body.tanggal_peminjaman,
      tanggal_kembali: req.body.tanggal_kembali,
      status_peminjaman: req.body.status_peminjaman,
      nama_file: fileName,
      file: url,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE peminjaman_ruangan SET ? WHERE id = ?;',
        [dataPeminjamanRuanganEdit, id],
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
          ...dataPeminjamanRuanganEdit,
        },
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

// Delete Data Produk
const deleteDataPeminjamanRuangan = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const ruangan = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM peminjaman_ruangan WHERE id = ?',
        [id],
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(rows[0]); // Ambil data pertama dari hasil query
          }
        }
      );
    });

    const filepath = `./public/dokumen/${ruangan.nama_file}`;
    if (ruangan.nama_file) {
      fs.unlinkSync(filepath); // Hapus file hanya jika nama_file tersedia
    }

    const result = await new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM peminjaman_ruangan WHERE id = ?;',
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
  getDataPeminjamanRuangan,
  getSingleDataPeminjamanRuangan,
  addDataPeminjamanRuangan,
  editDataPeminjamanRuangan,
  deleteDataPeminjamanRuangan,
};
