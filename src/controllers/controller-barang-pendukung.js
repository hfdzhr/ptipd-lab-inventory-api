const db = require('../configs/db.config');

// Menampilkan semua data
const getDataBarangPendukung = async (req, res) => {
  const tipe = req.query.tipe || 0;
  const kondisi = req.query.kondisi || 0;
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || '';
  const offset = page * limit;

  const totalRows = await new Promise((resolve, reject) => {
    const countBarangPendukungQuery = `SELECT COUNT(*) FROM komputer JOIN merk m ON id_merk = m.id JOIN ruangan r ON id_ruangan = r.id JOIN tipe_barang tb ON id_tipe = tb.id WHERE komputer.jenis = 'Barang Pendukung' AND tb.tipe_barang = ? AND komputer.kondisi =  ? AND (r.nama_ruangan LIKE ? OR m.nama_merk LIKE ? )`;

    db.query(
      countBarangPendukungQuery,
      [tipe, kondisi, `%${search}%`, `%${search}%`, `%${search}%`],
      function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows[0]['COUNT(*)']);
        }
      }
    );
  });

  const totalPage = Math.ceil(totalRows / limit);

  const data = await new Promise((resolve, reject) => {
    const getBarangPendukungQuery = `SELECT komputer.id, merk.id AS id_merk, merk.nama_merk, tipe_barang.id AS id_tipe, tipe_barang.tipe_barang, komputer.spek, komputer.jenis, komputer.kondisi, ruangan.id AS id_ruangan, ruangan.nama_ruangan, komputer.urutan_meja, komputer.created_at, komputer.updated_at FROM komputer JOIN merk ON id_merk = merk.id JOIN ruangan ON id_ruangan = ruangan.id JOIN tipe_barang ON id_tipe = tipe_barang.id WHERE komputer.jenis = 'Barang Pendukung' AND komputer.kondisi = ? AND (ruangan.nama_ruangan LIKE ? OR merk.nama_merk LIKE ? OR tipe_barang.tipe_barang LIKE ? OR komputer.spek LIKE ?)`;

    db.query(
      getBarangPendukungQuery,
      [tipe, kondisi, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
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
    res.send({
      code: 200,
      status: 'OK',
      data: data,
      count: totalRows,
      totalPage: totalPage,
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
    });
  }
};

const getSingleDataBarangPendukung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      const query = `SELECT komputer.id, merk.id AS id_merk, merk.nama_merk, tipe_barang.id AS id_tipe_barang, tipe_barang.tipe_barang, komputer.spek, komputer.jenis, komputer.kondisi, ruangan.id AS id_ruangan ,ruangan.nama_ruangan, komputer.urutan_meja, komputer.created_at, komputer.updated_at FROM komputer JOIN merk ON id_merk = merk.id JOIN ruangan ON id_ruangan = ruangan.id JOIN tipe_barang ON id_tipe = tipe_barang.id WHERE komputer.jenis = 'Barang Pendukung' AND komputer.id = ?;`;
      db.query(query, [id], function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });

    if (data && data.length > 0) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: data[0],
      });
    } else if (data.length === 0) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        message: 'Data yang anda cari tidak ditemukan',
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        error: {
          id: ['Silahkan cek kembali id barang pendukung'],
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
const addDataBarangPendukung = async (req, res) => {
  try {
    const dataBarangPendukung = {
      id_merk: parseInt(req.body.id_merk),
      id_tipe: parseInt(req.body.id_tipe),
      spek: req.body.spek,
      jenis: req.body.jenis || 'Barang Pendukung',
      kondisi: req.body.kondisi,
      id_ruangan: parseInt(req.body.id_ruangan),
      urutan_meja: req.body.urutan_meja || null,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO komputer SET ?;',
        [dataBarangPendukung],
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
        data: dataBarangPendukung,
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        errors: {
          id_merk: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Pastikan data sama dengan yang ada di tabel merk',
          ],
          id_tipe: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Pastikan data sama dengan yang ada di tabel tipe',
          ],
          spek: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
            'Jangan gunakan integer',
          ],
          kondisi: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
            'Jangan gunakan string',
            'Perhatikan kembali besar kecil',
          ],
          id_ruangan: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Jangan gunakan string',
            'Sesuaikan dengan data yang ada di tabel ruangan',
          ],
          urutan_meja: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Jangan gunakan string',
            'Sesuaikan dengan data yang ada ruangan',
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
const editDataBarangPendukung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const dataBarangPendukungEdit = {
      id_merk: parseInt(req.body.id_merk),
      id_tipe: parseInt(req.body.id_tipe),
      spek: req.body.spek,
      jenis: req.body.jenis || 'Barang Pendukung',
      kondisi: req.body.kondisi,
      id_ruangan: parseInt(req.body.id_ruangan),
      urutan_meja: req.body.urutan_meja || null,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE komputer SET ? WHERE id = ?;',
        [dataBarangPendukungEdit, id],
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
          ...dataBarangPendukungEdit,
        },
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        errors: {
          id_merk: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Pastikan data sama dengan yang ada di tabel merk',
          ],
          id_tipe: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Pastikan data sama dengan yang ada di tabel tipe',
          ],
          spek: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
            'Jangan gunakan integer',
          ],
          kondisi: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
            'Jangan gunakan string',
            'Perhatikan kembali besar kecil',
          ],
          id_ruangan: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Jangan gunakan string',
            'Sesuaikan dengan data yang ada di tabel ruangan',
          ],
          urutan_meja: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Jangan gunakan string',
            'Sesuaikan dengan data yang ada ruangan',
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
const deleteDataBarangPendukung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM komputer WHERE id = ?;',
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
  getDataBarangPendukung,
  getSingleDataBarangPendukung,
  addDataBarangPendukung,
  editDataBarangPendukung,
  deleteDataBarangPendukung,
};
