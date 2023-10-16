const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataBarangPendukung = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    connection.query(
      'SELECT barang_pendukung.id, barang_pendukung.nama_barang, tipe_barang.tipe_barang, merk.nama_merk, barang_pendukung.kondisi, barang_pendukung.keterangan FROM barang_pendukung JOIN tipe_barang ON id_tipe_barang = tipe_barang.id JOIN merk ON id_merk = merk.id',
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

const getSingleDataBarangPendukung = async (req, res) => {
  const id = req.params.id;
  const data = await new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM barang_pendukung WHERE id = ?;',
      [id],
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
      data: data[0],
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
      error: {
        id: ['Silahkan cek kembali id produk'],
      },
    });
  }
};

// Menambahkan data produk
const addDataBarangPendukung = async (req, res) => {
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
      data: dataBarangPendukung,
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {},
    });
  }
};

// Mengubah data
const editDataBarangPendukung = async (req, res) => {
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
        ...dataBarangPendukungEdit,
      },
    });
  } else {
    res.send({
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
};

// Delete Data Produk
const deleteDataBarangPendukung = async (req, res) => {
  let id = req.params.id;

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM barang_pendukung WHERE id = ?;',
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
  getDataBarangPendukung,
  getSingleDataBarangPendukung,
  addDataBarangPendukung,
  editDataBarangPendukung,
  deleteDataBarangPendukung,
};
