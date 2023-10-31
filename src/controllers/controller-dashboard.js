const db = require('../configs/db.config');

// Menampilkan semua data
const getDashboardData = async (req, res) => {
  try {
    const [komputerRusakResult, ruanganResult, komputerResult, barangResult] =
      await Promise.all([
        queryDatabase(
          'SELECT COUNT(*) AS jumlah_komputer_rusak FROM komputer WHERE kondisi = "Rusak"'
        ),
        queryDatabase('SELECT COUNT(*) AS jumlah_ruangan FROM ruangan'),
        queryDatabase('SELECT COUNT(*) AS jumlah_komputer FROM komputer'),
        queryDatabase('SELECT COUNT(*) AS jumlah_barang FROM barang_pendukung'),
      ]);

    if (
      komputerRusakResult &&
      ruanganResult &&
      komputerResult &&
      barangResult
    ) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: {
          jumlah_komputer_rusak: komputerRusakResult[0].jumlah_komputer_rusak,
          jumlah_ruangan: ruanganResult[0].jumlah_ruangan,
          jumlah_komputer: komputerResult[0].jumlah_komputer,
          jumlah_barang_pendukung: barangResult[0].jumlah_barang,
        },
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

const queryDatabase = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  getDashboardData,
};
