const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataRuangan = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM ruangan', function (error, rows) {
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

const getSingleDataRuangan = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM ruangan WHERE id = ?;',
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
const addDataRuangan = async (req, res) => {
  try {
    let dataRuangan = {
      nama_ruangan: req.body.nama_ruangan,
      jumlah_komputer_laptop: req.body.jumlah_komputer_laptop,
      penanggung_jawab: req.body.penanggung_jawab,
    };

    const result = await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO ruangan SET ?;',
        [dataRuangan],
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
        data: dataRuangan,
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        errors: {
          nama_ruangan: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
          ],
          jumlah_komputer: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Jangan gunakan tipe data string',
          ],
          penanggung_jawab: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
            'Jangan gunakan integer',
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
const editDataRuangan = async (req, res) => {
  try {
    let id = req.params.id;
    let dataRuanganEdit = {
      nama_ruangan: req.body.nama_ruangan,
      jumlah_komputer_laptop: req.body.jumlah_komputer_laptop,
      penanggung_jawab: req.body.penanggung_jawab,
    };

    const result = await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE ruangan SET ? WHERE id = ?;',
        [dataRuanganEdit, id],
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
          ...dataRuanganEdit,
        },
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        errors: {
          nama_ruangan: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
          ],
          jumlah_komputer: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data integer',
            'Jangan gunakan tipe data string',
          ],
          penanggung_jawab: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
            'Jangan gunakan integer',
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
const deleteDataRuangan = async (req, res) => {
  try {
    let id = req.params.id;
    const result = await new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM ruangan WHERE id = ?;',
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
            'Dimulai dari angak 2000',
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
  getDataRuangan,
  getSingleDataRuangan,
  addDataRuangan,
  editDataRuangan,
  deleteDataRuangan,
};
