const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataBarangPendukung = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT barang_pendukung.id, barang_pendukung.nama_barang, tipe_barang.tipe_barang, merk.nama_merk, barang_pendukung.kondisi, barang_pendukung.keterangan FROM barang_pendukung JOIN tipe_barang ON id_tipe_barang = tipe_barang.id JOIN merk ON id_merk = merk.id',
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

const getSingleDataBarangPendukung = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT barang_pendukung.id, barang_pendukung.nama_barang, tipe_barang.tipe_barang, merk.nama_merk, barang_pendukung.kondisi, barang_pendukung.keterangan FROM barang_pendukung JOIN tipe_barang ON id_tipe_barang = tipe_barang.id JOIN merk ON id_merk = merk.id WHERE barang_pendukung.id = ?;',
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

// Menambahkan data produk
const addDataBarangPendukung = async (req, res) => {
  try {
    let dataBarangPendukung = {
      nama_barang: req.body.nama_barang,
      id_tipe_barang: req.body.id_tipe_barang,
      id_merk: req.body.id_merk,
      kondisi: req.body.kondisi,
      keterangan: req.body.keterangan,
    };

    const result = await new Promise((resolve, reject) => {
      connection.query(
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
    id = req.params.id;
    let dataBarangPendukungEdit = {
      nama_barang: req.body.nama_barang,
      id_tipe_barang: req.body.id_tipe_barang,
      id_merk: req.body.id_merk,
      kondisi: req.body.kondisi,
      keterangan: req.body.keterangan,
    };

    const result = await new Promise((resolve, reject) => {
      connection.query(
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

// Delete Data Produk
const deleteDataBarangPendukung = async (req, res) => {
  try {
    let id = req.params.id;

    const result = await new Promise((resolve, reject) => {
      connection.query(
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
