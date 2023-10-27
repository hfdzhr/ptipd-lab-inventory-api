const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataMerk = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM merk', function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
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

const getSingleDataMerk = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM merk WHERE id = ?;',
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
const addDataMerk = async (req, res) => {
  try {
    let dataMerk = {
      nama_merk: req.body.nama_merk,
    };

    const result = await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO merk SET ?;',
        [dataMerk],
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
        data: dataMerk,
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

// Mengubah data
const editDataMerk = async (req, res) => {
  try {
    id = req.params.id;
    let dataMerk = {
      nama_merk: req.body.nama_merk,
    };

    const result = await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE merk SET ? WHERE id = ?;',
        [dataMerk, id],
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
          ...dataMerk,
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
const deleteDataMerk = async (req, res) => {
  try {
    let id = req.params.id;

    const result = await new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM merk WHERE id = ?;',
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
  getDataMerk,
  getSingleDataMerk,
  addDataMerk,
  editDataMerk,
  deleteDataMerk,
};
