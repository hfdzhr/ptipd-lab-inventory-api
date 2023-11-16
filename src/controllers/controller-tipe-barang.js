const db = require('../configs/db.config');

// Menampilkan semua data
const getDataTipeBarang = async (req, res) => {
  try {
    const search = req.query.search_query || '';
    const data = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM tipe_barang WHERE tipe_barang LIKE ?',
        [`%${search}%`],
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

const getSingleDataTipeBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM tipe_barang WHERE id = ?;',
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
        message: 'Data yang anda cari tidak ada',
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
const addDataTipeBarang = async (req, res) => {
  try {
    let dataTipeBarang = {
      tipe_barang: req.body.tipe_barang,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO tipe_barang SET ?;',
        [dataTipeBarang],
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
        data: dataTipeBarang,
      });
    } else {
      res.status(400).send({
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
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: error.message,
    });
  }
};

// Mengubah data
const editDataTipeBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let dataTipeBarang = {
      tipe_barang: req.body.tipe_barang,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE tipe_barang SET ? WHERE id = ?;',
        [dataTipeBarang, id],
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
          ...dataTipeBarang,
        },
      });
    } else {
      res.status(400).send({
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
  } catch (error) {
    res.status(500).send({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      error: error.message,
    });
  }
};

// Delete Data Produk
const deleteDataTipeBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM tipe_barang WHERE id = ?;',
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
  getDataTipeBarang,
  getSingleDataTipeBarang,
  addDataTipeBarang,
  editDataTipeBarang,
  deleteDataTipeBarang,
};
