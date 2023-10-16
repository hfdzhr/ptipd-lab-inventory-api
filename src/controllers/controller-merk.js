const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataMerk = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    connection.query('SELECT * FROM merk', function (error, rows) {
      if (rows) {
        resolve(rows);
      } else {
        reject([]);
      }
    });
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

const getSingleDataMerk = async (req, res) => {
  const id = req.params.id;
  const data = await new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM merk WHERE id = ?;',
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
        id: ['Silahkan cek kembali id'],
      },
    });
  }
};

// Menambahkan data produk
const addDataMerk = async (req, res) => {
  let dataMerk = {
    nama_merk: req.body.nama_merk,
  };

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO merk SET ?;',
      [dataMerk],
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
      data: dataMerk,
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

// Mengubah data
const editDataMerk = async (req, res) => {
  id = req.params.id;
  let dataMerk = {
    nama_merk: req.body.nama_merk,
  };

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'UPDATE merk SET ? WHERE id = ?;',
      [dataMerk, id],
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
        ...dataMerk,
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
const deleteDataMerk = async (req, res) => {
  let id = req.params.id;

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM merk WHERE id = ?;',
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
  getDataMerk,
  getSingleDataMerk,
  addDataMerk,
  editDataMerk,
  deleteDataMerk,
};
