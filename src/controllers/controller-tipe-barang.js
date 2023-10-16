const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataTipeBarang = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    connection.query('SELECT * FROM tipe_barang', function (error, rows) {
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

const getSingleDataTipeBarang = async (req, res) => {
  const id = req.params.id;
  const data = await new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM tipe_barang WHERE id = ?;',
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
const addDataTipeBarang = async (req, res) => {
  let dataTipeBarang = {
    tipe_barang: req.body.tipe_barang,
  };

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO tipe_barang SET ?;',
      [dataTipeBarang],
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
      data: dataTipeBarang,
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        tipe_barang: [
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
const editDataTipeBarang = async (req, res) => {
  id = req.params.id;
  let dataTipeBarang = {
    tipe_barang: req.body.tipe_barang,
  };

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'UPDATE tipe_barang SET ? WHERE id = ?;',
      [dataTipeBarang, id],
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
        ...dataTipeBarang,
      },
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
      errors: {
        tipe_barang: [
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
const deleteDataTipeBarang = async (req, res) => {
  let id = req.params.id;

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM tipe_barang WHERE id = ?;',
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
  getDataTipeBarang,
  getSingleDataTipeBarang,
  addDataTipeBarang,
  editDataTipeBarang,
  deleteDataTipeBarang,
};
