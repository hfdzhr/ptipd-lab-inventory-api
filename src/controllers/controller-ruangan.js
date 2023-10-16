const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataRuangan = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    connection.query('SELECT * FROM ruangan', function (error, rows) {
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

const getSingleDataRuangan = async (req, res) => {
  const id = req.params.id;
  const data = await new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM ruangan WHERE id = ?;',
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
const addDataRuangan = async (req, res) => {
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
      data: dataRuangan,
    });
  } else {
    res.send({
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
};

// Mengubah data
const editDataRuangan = async (req, res) => {
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
        ...dataRuanganEdit
      }
    });
  } else {
    res.send({
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
};

// Delete Data Produk
const deleteDataRuangan = async (req, res) => {
  let id = req.params.id;

  const result = await new Promise((resolve, reject) => {
    connection.query(
      'DELETE FROM ruangan WHERE id = ?;',
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
          'Dimulai dari angak 2000',
          'Cek kembeli parameter',
        ],
      },
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
