const config = require('../configs/database');
const mysql = require('mysql');
const connection = mysql.createConnection(config);
connection.connect();

// Menampilkan semua data
const getDataKomputer = async (req, res) => {
  const filterQuery = req.query.tipe;

  const data = await new Promise((resolve, reject) => {
    let getKomputerQuery =
      'SELECT komputer.id, merk.nama_merk, tipe_barang.tipe_barang, komputer.processor, komputer.ram, komputer.storage , komputer.kondisi, ruangan.nama_ruangan, komputer.urutan_meja FROM komputer JOIN merk ON id_merk = merk.id JOIN ruangan ON id_ruangan = ruangan.id JOIN tipe_barang ON id_tipe = tipe_barang.id ';

    if (filterQuery) {
      getKomputerQuery += 'WHERE tipe_barang = ?';
    }

    connection.query(getKomputerQuery, [filterQuery], function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
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

const getSingleDataKomputer = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await new Promise((resolve, reject) => {
      const query = `SELECT komputer.id, merk.nama_merk, tipe_barang.tipe_barang, komputer.processor, komputer.ram, komputer.storage , komputer.kondisi, ruangan.nama_ruangan, komputer.urutan_meja FROM komputer JOIN merk ON id_merk = merk.id JOIN ruangan ON id_ruangan = ruangan.id JOIN tipe_barang ON id_tipe = tipe_barang.id WHERE komputer.id = ?;`;
      connection.query(query, [id], function (error, rows) {
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
    } else if(data.length === 0) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        message: 'Data yang anda cari tidak ditemukan'
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        error: {
          id: ['Silahkan cek kembali id komputer'],
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
const addDataKomputer = async (req, res) => {
  try {
    let dataKomputer = {
      id_merk: req.body.id_merk,
      id_tipe: req.body.id_tipe,
      processor: req.body.processor,
      ram: req.body.ram,
      storage: req.body.storage,
      kondisi: req.body.kondisi,
      id_ruangan: req.body.id_ruangan,
      urutan_meja: req.body.urutan_meja,
    };

    const result = await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO komputer SET ?;',
        [dataKomputer],
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
        data: dataKomputer,
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
          spek_komputer: [
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
const editDataKomputer = async (req, res) => {
  try {
    let dataKomputerEdit = {
      id_merk: req.body.id_merk,
      id_tipe: req.body.id_tipe,
      processor: req.body.processor,
      ram: req.body.ram,
      storage: req.body.storage,
      kondisi: req.body.kondisi,
      id_ruangan: req.body.id_ruangan,
      urutan_meja: req.body.urutan_meja,
    };

    const result = await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE komputer SET ? WHERE id = ?;',
        [dataKomputerEdit, id],
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
          ...dataKomputerEdit,
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
          spek_komputer: [
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
const deleteDataKomputer = async (req, res) => {
  try {
    let id = req.params.id;

    const result = await new Promise((resolve, reject) => {
      connection.query(
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
  getDataKomputer,
  getSingleDataKomputer,
  addDataKomputer,
  editDataKomputer,
  deleteDataKomputer,
};
