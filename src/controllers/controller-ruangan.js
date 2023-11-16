const db = require('../configs/db.config');
const SQL = require('sql-template-strings');

// Menampilkan semua data
const getDataRuangan = async (req, res) => {
  try {
    const search = req.query.search_query || '';
    const data = await new Promise((resolve, reject) => {
      const selectAllRuanganQuery = SQL`SELECT * FROM ruangan WHERE nama_ruangan LIKE ?`;

      db.query(selectAllRuanganQuery, [`%${search}%`], function (error, rows) {
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
    const ruanganId = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      const selectRuanganByIdQuery = SQL`SELECT * FROM ruangan WHERE id = ${ruanganId}`;

      db.query(selectRuanganByIdQuery, function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
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
    const ruanganData = {
      nama_ruangan: req.body.nama_ruangan,
      jumlah_komputer_laptop: parseInt(req.body.jumlah_komputer_laptop),
      penanggung_jawab: req.body.penanggung_jawab,
    };
    const insertRuanganQuery = SQL`INSERT INTO ruangan SET ${ruanganData}`;

    const result = await new Promise((resolve, reject) => {
      db.query(insertRuanganQuery, function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });

    if (result) {
      res.status(201).send({
        code: 201,
        status: 'CREATED',
        data: ruanganData,
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
    const ruanganId = parseInt(req.params.id);
    const ruanganData = {
      nama_ruangan: req.body.nama_ruangan,
      jumlah_komputer_laptop: req.body.jumlah_komputer_laptop,
      penanggung_jawab: req.body.penanggung_jawab,
    };
    const updateRuanganQuery = SQL`UPDATE ruangan SET ${ruanganData} WHERE id = ${ruanganId}`;

    const result = await new Promise((resolve, reject) => {
      db.query(updateRuanganQuery, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });

    if (result) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: {
          id: ruanganId,
          ...ruanganData,
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
    const ruanganId = parseInt(req.params.id);
    const deleteRuanganByIdQuery = SQL`DELETE FROM ruangan WHERE id = ${ruanganId}`;

    const result = await new Promise((resolve, reject) => {
      db.query(deleteRuanganByIdQuery, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });

    if (result) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        deleted_data_id: ruanganId,
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
