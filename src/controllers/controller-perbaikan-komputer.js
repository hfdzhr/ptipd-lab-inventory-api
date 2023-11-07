const db = require('../configs/db.config');

const getDataPerbaikanKomputer = async (req, res) => {
  const totalRows = await new Promise((resolve, reject) => {
    const countDataPerbaikanKomputer = `SELECT
	COUNT(*)
FROM
	perbaikan_komputer pk
JOIN komputer k ON
	pk.id_komputer = k.id;`;

    db.query(countDataPerbaikanKomputer, function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows[0]['COUNT(*)']);
      }
    });
  });

  const data = await new Promise((resolve, reject) => {
    let queryDataPerbaikanKomputer = `SELECT 
	pk.id,
	pk.id_komputer,
	r.nama_ruangan,
    k.urutan_meja,
	k.kondisi,
	pk.jenis_perbaikan,
	pk.tanggal_mulai,
	pk.tanggal_berakhir, 
    pk.created_at,
    pk.updated_at
FROM
	perbaikan_komputer pk 
JOIN komputer k ON
	pk.id_komputer = k.id
JOIN ruangan r ON
	k.id_ruangan = r.id;`;

    db.query(queryDataPerbaikanKomputer, function (error, rows) {
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

const getSingleDataPerbaikanKomputer = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await new Promise((resolve, reject) => {
      const querySingleDataPerbaikan = `SELECT 
      pk.id,
      pk.id_komputer,
      r.nama_ruangan,
      k.urutan_meja,
      k.kondisi,
      pk.jenis_perbaikan,
      pk.tanggal_mulai,
      pk.tanggal_berakhir,
      pk.created_at,
      pk.updated_at
  FROM
      perbaikan_komputer pk 
  JOIN komputer k ON
      pk.id_komputer = k.id
  JOIN ruangan r ON
      k.id_ruangan = r.id
  WHERE pk.id = ?;`;
      db.query(querySingleDataPerbaikan, [id], function (error, rows) {
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
const addDataPerbaikanKomputer = async (req, res) => {
  try {
    let dataPerbaikanKomputer = {
      id_komputer: parseInt(req.body.id_komputer),
      jenis_perbaikan: req.body.jenis_perbaikan,
      tanggal_mulai: req.body.tanggal_mulai,
      tanggal_berakhir: req.body.tanggal_berakhir,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO perbaikan_komputer SET ?;',
        [dataPerbaikanKomputer],
        function (error) {
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
        data: dataPerbaikanKomputer,
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
const editDataPerbaikanKomputer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let dataPerbaikanKomputerEdit = {
      id_komputer: parseInt(req.body.id_komputer),
      jenis_perbaikan: req.body.jenis_perbaikan,
      tanggal_mulai: req.body.tanggal_mulai,
      tanggal_berakhir: req.body.tanggal_berakhir,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE perbaikan_komputer SET ? WHERE id = ?;',
        [dataPerbaikanKomputerEdit, id],
        function (error) {
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
          ...dataPerbaikanKomputerEdit,
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
const deleteDataPerbaikanKomputer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM perbaikan_komputer WHERE id = ?;',
        [id],
        function (error) {
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
  getDataPerbaikanKomputer,
  getSingleDataPerbaikanKomputer,
  addDataPerbaikanKomputer,
  editDataPerbaikanKomputer,
  deleteDataPerbaikanKomputer,
};
