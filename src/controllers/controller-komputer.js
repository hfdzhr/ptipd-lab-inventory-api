const { log } = require('util');
const db = require('../configs/db.config');

// Menampilkan semua data
const getDataKomputer = async (req, res) => {
  const tipe = req.query.tipe || 0;
  const kondisi = req.query.kondisi || 0;
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || '';
  const offset = page * limit;

  const totalRows = await new Promise((resolve, reject) => {
    let countKomputerQuery = `SELECT COUNT(*) FROM komputer JOIN merk m ON id_merk = m.id JOIN ruangan r ON id_ruangan = r.id JOIN tipe_barang tb ON id_tipe = tb.id WHERE tb.tipe_barang = ? AND komputer.kondisi = ? AND (r.nama_ruangan LIKE ? OR m.nama_merk LIKE ?)`;

    db.query(
      countKomputerQuery,
      [tipe, kondisi, `%${search}%`, `%${search}%`],
      function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows[0]['COUNT(*)']);
        }
      }
    );
  });

  const totalPage = Math.ceil(totalRows / limit);

  const data = await new Promise((resolve, reject) => {
    let getKomputerQuery = `SELECT komputer.id, merk.id AS id_merk, merk.nama_merk, tipe_barang.id AS id_tipe, tipe_barang.tipe_barang, komputer.processor, komputer.ram, komputer.storage, komputer.kondisi, ruangan.id AS id_ruangan, ruangan.nama_ruangan, komputer.urutan_meja, komputer.created_at, komputer.updated_at FROM komputer JOIN merk ON id_merk = merk.id JOIN ruangan ON id_ruangan = ruangan.id JOIN tipe_barang ON id_tipe = tipe_barang.id WHERE tipe_barang.tipe_barang = ? AND komputer.kondisi = ? AND (ruangan.nama_ruangan LIKE ? OR merk.nama_merk LIKE ?) ORDER BY komputer.id DESC LIMIT ? OFFSET ?`;

    db.query(
      getKomputerQuery,
      [tipe, kondisi, `%${search}%`, `%${search}%`, limit, offset],
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
    res.send({
      code: 200,
      status: 'OK',
      data: data,
      count: totalRows,
      totalPage: totalPage,
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
    const id = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      const query = `SELECT komputer.id, merk.id AS id_merk, merk.nama_merk, tipe_barang.id AS id_tipe_barang, tipe_barang.tipe_barang, komputer.processor, komputer.ram, komputer.storage , komputer.kondisi, ruangan.id AS id_ruangan ,ruangan.nama_ruangan, komputer.urutan_meja, komputer.created_at, komputer.updated_at FROM komputer JOIN merk ON id_merk = merk.id JOIN ruangan ON id_ruangan = ruangan.id JOIN tipe_barang ON id_tipe = tipe_barang.id WHERE komputer.id = ?;`;
      db.query(query, [id], function (error, rows) {
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
    } else if (data.length === 0) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        message: 'Data yang anda cari tidak ditemukan',
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
      id_merk: parseInt(req.body.id_merk),
      id_tipe: parseInt(req.body.id_tipe),
      processor: req.body.processor,
      ram: parseInt(req.body.ram),
      storage: parseInt(req.body.storage),
      kondisi: req.body.kondisi,
      id_ruangan: parseInt(req.body.id_ruangan),
      urutan_meja: req.body.urutan_meja,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
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
    const id = parseInt(req.params.id);
    let dataKomputerEdit = {
      id_merk: parseInt(req.body.id_merk),
      id_tipe: parseInt(req.body.id_tipe),
      processor: req.body.processor,
      ram: parseInt(req.body.ram),
      storage: parseInt(req.body.storage),
      kondisi: req.body.kondisi,
      id_ruangan: parseInt(req.body.id_ruangan),
      urutan_meja: req.body.urutan_meja,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
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
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      db.query(
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

const statistikDataKomputer = async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const kondisiKomputer = req.query.kondisi || 0;
    const tahun = req.query.tahun || currentYear;

    const result = await new Promise((resolve, reject) => {
      const queryStatistikKomputer =
        "SELECT DATE_FORMAT(created_at, '%M') AS bulan, DATE_FORMAT(created_at, '%Y') AS tahun, COUNT(*) AS jumlah FROM komputer WHERE kondisi = ? AND YEAR(created_at) = ? GROUP BY DATE_FORMAT(created_at, '%Y-%m')";
      db.query(
        queryStatistikKomputer,
        [kondisiKomputer, tahun],
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });

    if (result) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: result,
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
  statistikDataKomputer,
};
