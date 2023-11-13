const { log } = require('util');
const db = require('../configs/db.config');

// Menampilkan semua data
const getDataJadwalMaintenance = async (req, res) => {
  // const tipe = req.query.tipe || 0;
  // const kondisi = req.query.kondisi || 0;
  // const page = parseInt(req.query.page) || 0;
  // const limit = parseInt(req.query.limit) || 10;
  // const search = req.query.search_query || '';

  const totalRows = await new Promise((resolve, reject) => {
    let countJadwalMaintenanceQuery = `SELECT
    COUNT(*)
  FROM
    jadwal_maintenance jm
  JOIN ruangan r ON 
    id_ruangan = r.id`;

    db.query(countJadwalMaintenanceQuery, function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows[0]['COUNT(*)']);
      }
    });
  });

  const data = await new Promise((resolve, reject) => {
    let getJadwalMaintenanceQuery = `SELECT 
    jm.id,
    jm.nama,
    jm.id_ruangan,
    r.nama_ruangan,
    jm.tanggal_mulai,
    jm.tanggal_berakhir,
    jm.created_at,
    jm.updated_at 
  FROM jadwal_maintenance jm
  JOIN ruangan r ON 
    id_ruangan = r.id`;

    db.query(getJadwalMaintenanceQuery, function (error, rows) {
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
      count: totalRows,
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
    });
  }
};

const getSingleDataJadwalMaintenance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await new Promise((resolve, reject) => {
      let getJadwalMaintenanceQuery = `SELECT 
    jm.id,
    jm.nama,
    jm.id_ruangan,
    r.nama_ruangan,
    jm.tanggal_mulai,
    jm.tanggal_berakhir
  FROM jadwal_maintenance jm
  JOIN ruangan r ON 
    id_ruangan = r.id
  WHERE jm.id = ?`;
      db.query(getJadwalMaintenanceQuery, [id], function (error, rows) {
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
const addDataJadwalMaintenance = async (req, res) => {
  try {
    let dataJadwalMaintenance = {
      id_ruangan: parseInt(req.body.id_ruangan),
      nama: req.body.nama,
      tanggal_mulai: req.body.tanggal_mulai,
      tanggal_berakhir: req.body.tanggal_berakhir,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO jadwal_maintenance SET ?;',
        [dataJadwalMaintenance],
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
        data: dataJadwalMaintenance,
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
const editDataJadwalMaintenance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let dataJadwalMaintenanceEdit = {
      id_ruangan: parseInt(req.body.id_ruangan),
      nama: req.body.nama,
      tanggal_mulai: req.body.tanggal_mulai,
      tanggal_berakhir: req.body.tanggal_berakhir,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE jadwal_maintenance SET ? WHERE id = ?;',
        [dataJadwalMaintenanceEdit, id],
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
          ...dataJadwalMaintenanceEdit,
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
const deleteDataJadwalMaintenance = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM jadwal_maintenance WHERE id = ?;',
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

// const statistikDataKomputer = async (req, res) => {
//   try {
//     const today = new Date();
//     const currentYear = today.getFullYear();
//     const kondisiKomputer = req.query.kondisi || 0;
//     const tahun = parseInt(req.query.tahun) || currentYear;

//     const result = await new Promise((resolve, reject) => {
//       const queryStatistikKomputer = `
//       WITH RECURSIVE MonthsList AS (
//         SELECT 1 AS m
//         UNION ALL
//         SELECT m + 1
//         FROM MonthsList
//         WHERE m < 12
//       )

//       SELECT ? AS tahun, MonthsList.m AS bulan, MONTHNAME(STR_TO_DATE(CONCAT(MonthsList.m, ' 1'), '%m %d')) AS nama_bulan, COALESCE(COUNT(k.created_at), 0) AS jumlah_komputer
//       FROM MonthsList
//       LEFT JOIN komputer k ON MONTH(k.created_at) = MonthsList.m AND YEAR(k.created_at) = ? AND k.kondisi = ?
//       GROUP BY MonthsList.m;
//       `;
//       db.query(
//         queryStatistikKomputer,
//         [tahun, tahun, kondisiKomputer],
//         function (error, rows) {
//           if (error) {
//             reject(error);
//           } else {
//             resolve(rows);
//           }
//         }
//       );
//     });

//     if (result) {
//       res.status(200).send({
//         code: 200,
//         status: 'OK',
//         kondisi: kondisiKomputer,
//         data: result,
//       });
//     } else {
//       res.status(400).send({
//         code: 400,
//         status: 'BAD_REQUEST',
//         errors: {
//           id: [
//             'Gunakan tipe data integer',
//             'Cek kembali nomor id',
//             'Gunakan id yang sesuai',
//             'Berisikan 4 digit',
//             'Tidak boleh kosong',
//             'Tidak boleh berisi data null',
//             'Cek kembeli parameter',
//           ],
//         },
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       code: 500,
//       status: 'INTERNAL_SERVER_ERROR',
//       error: error.message,
//     });
//   }
// };

module.exports = {
  getDataJadwalMaintenance,
  getSingleDataJadwalMaintenance,
  addDataJadwalMaintenance,
  editDataJadwalMaintenance,
  deleteDataJadwalMaintenance,
};
