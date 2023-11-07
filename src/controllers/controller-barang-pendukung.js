const { log } = require('util');
const db = require('../configs/db.config');

// Menampilkan semua data
const getDataBarangPendukung = async (req, res) => {
  try {
    const kondisi = req.query.kondisi || 0;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || '';
    const offset = page * limit;

    const totalRows = await new Promise((resolve, reject) => {
      const countBarangPendkungQuery = `SELECT
      COUNT(*)
    FROM
      barang_pendukung
    JOIN merk ON
      barang_pendukung.id_merk = merk.id
    JOIN tipe_barang ON
      barang_pendukung.id_tipe_barang = tipe_barang.id
    WHERE
      barang_pendukung.kondisi = ?
      AND (tipe_barang.tipe_barang LIKE ?
        OR merk.nama_merk LIKE ?
        OR barang_pendukung.nama_barang LIKE ?);`;

      db.query(
        countBarangPendkungQuery,
        [kondisi, `%${search}%`, `%${search}%`, `%${search}%`],
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
      const queryGetDataKomputer = `SELECT
      barang_pendukung.id,
      barang_pendukung.nama_barang,
      barang_pendukung.id_tipe_barang
      tipe_barang.tipe_barang,
      barang_pendukung.id_merk,
      merk.nama_merk,
      barang_pendukung.kondisi,
      barang_pendukung.keterangan,
      barang_pendukung.id_ruangan,
      ruangan.nama_ruangan,
      barang_pendukung.created_at,
      barang_pendukung.updated_at
    FROM
      barang_pendukung
    JOIN merk ON
      id_merk = merk.id
    JOIN tipe_barang ON
      id_tipe_barang = tipe_barang.id
    JOIN ruangan ON 
      id_ruangan = ruangan.id
    WHERE
      barang_pendukung.kondisi = ?
      AND (tipe_barang.tipe_barang LIKE ?
        OR merk.nama_merk LIKE ?
        OR barang_pendukung.nama_barang LIKE ?)
    ORDER BY
      barang_pendukung.id DESC
    LIMIT ? OFFSET ?;`;
      db.query(
        queryGetDataKomputer,
        [kondisi, `%${search}%`, `%${search}%`, `%${search}%`, limit, offset],
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

// Mengambil Single Data
const getSingleDataBarangPendukung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      const queryEditDataBarangPendukung = `SELECT
      barang_pendukung.id,
      barang_pendukung.nama_barang,
      barang_pendukung.id_tipe_barang,
      tipe_barang.tipe_barang,
      barang_pendukung.id_merk,
      merk.nama_merk,
      barang_pendukung.kondisi,
      barang_pendukung.keterangan,
      barang_pendukung.id_ruangan,
      ruangan.nama_ruangan,
      barang_pendukung.created_at,
      barang_pendukung.updated_at
    FROM
      barang_pendukung
    JOIN merk ON
      id_merk = merk.id
    JOIN tipe_barang ON
      id_tipe_barang = tipe_barang.id
    JOIN ruangan ON 
      id_ruangan = ruangan.id
    WHERE
      barang_pendukung.id = ?
    ;`
      db.query(
        queryEditDataBarangPendukung,
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
          id: ['Silahkan cek kembali id produk'],
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

// Menambahkan data
const addDataBarangPendukung = async (req, res) => {
  try {
    let dataBarangPendukung = {
      nama_barang: req.body.nama_barang,
      id_tipe_barang: parseInt(req.body.id_tipe_barang),
      id_merk: parseInt(req.body.id_merk),
      kondisi: req.body.kondisi,
      keterangan: req.body.keterangan,
      id_ruangan: req.body.id_ruangan,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO barang_pendukung SET ?;',
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
        errors: {},
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

    let dataBarangPendukungEdit = {
      nama_barang: req.body.nama_barang,
      id_tipe_barang: parseInt(req.body.id_tipe_barang),
      id_merk: parseInt(req.body.id_merk),
      kondisi: req.body.kondisi,
      keterangan: req.body.keterangan,
      id_ruangan: req.body.id_ruangan,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE barang_pendukung SET ? WHERE id = ?;',
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
          nama_merk: [
            'Harus menggunakan tipe data string',
            'Data tidak boleh kosong',
            'Data tidak boleh berisikan tipe data null',
            'Perhatikan kembali huruf besar kecil',
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

// Delete Data
const deleteDataBarangPendukung = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM barang_pendukung WHERE id = ?;',
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
