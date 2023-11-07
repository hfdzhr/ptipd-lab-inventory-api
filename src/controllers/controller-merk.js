const db = require('../configs/db.config');

// Menampilkan semua data
const getDataMerk = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const selectAllMerkQuery = `SELECT * FROM merk`;

      db.query(selectAllMerkQuery, (error, rows) => {
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
    const merkId = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      const selectMerkByIdQuery = `SELECT * FROM merk WHERE id = ?`;

      db.query(selectMerkByIdQuery, [merkId], (error, rows) => {
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
const addDataMerk = async (req, res) => {
  try {
    const merkData = {
      nama_merk: req.body.nama_merk,
    };
    const insertMerkQuery = `INSERT INTO merk SET ?`;

    const result = await new Promise((resolve, reject) => {
      db.query(insertMerkQuery, [merkData], (error) => {
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
    const merkId = parseInt(req.params.id);
    const merkData = {
      nama_merk: req.body.nama_merk,
    };
    const updateMerkQuery = SQL`UPDATE merk SET ? WHERE id = ?`;

    const result = await new Promise((resolve, reject) => {
      db.query(updateMerkQuery, [merkData, merkId], function (error, rows) {
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
          id: merkId,
          ...merkData,
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
    const merkId = parseInt(req.params.id);
    const deleteMerkByIdQuery = `DELETE FROM merk WHERE id = ?`;

    const result = await new Promise((resolve, reject) => {
      db.query(deleteMerkByIdQuery, [merkId], function (error, rows) {
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
        deleted_data_id: merkId,
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
