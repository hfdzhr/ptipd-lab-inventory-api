const db = require('../configs/db.config');

// Menampilkan semua data
const getDataPeminjamanBarang = async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const queryPeminjamanRuangan = `SELECT 
      pb.id,
      pb.peminjam,
      pb.instansi,
      pb.id_barang_pendukung,
      bp.nama_barang,
      m_bp.nama_merk AS merk_bp,
      tb_bp.tipe_barang AS tipe_barang_bp,
      bp.id_ruangan AS id_ruangan_bp,
      r_bp.nama_ruangan AS nama_ruangan_bp,
      pb.id_komputer,
      m_k.nama_merk AS nama_merk_k,
      tb_k.tipe_barang AS tipe_barang_k,
      k.id_ruangan,
      r_k.nama_ruangan AS nama_ruangan_k,
      k.urutan_meja,
      pb.tgl_peminjaman,
      pb.tgl_kembali,
      pb.status_peminjaman,
      pb.created_at,
      pb.updated_at
  FROM peminjaman_barang pb
  LEFT JOIN komputer k ON pb.id_komputer = k.id
  LEFT JOIN barang_pendukung bp ON pb.id_barang_pendukung = bp.id
  LEFT JOIN ruangan r_k ON k.id_ruangan = r_k.id
  LEFT JOIN ruangan r_bp ON bp.id_ruangan = r_bp.id
  LEFT JOIN tipe_barang tb_k ON k.id_tipe = tb_k.id
  LEFT JOIN tipe_barang tb_bp ON bp.id_tipe_barang = tb_bp.id
  LEFT JOIN merk m_k ON k.id_merk = m_k.id
  LEFT JOIN merk m_bp ON bp.id_merk = m_bp.id;`;
      db.query(queryPeminjamanRuangan, function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
    const nestedData = data.map((item) => ({
      id: item.id,
      nama_peminjam: item.peminjam,
      instansi: item.instansi,
      barang_pendukung: {
        id_barang_pendukung: item.id_barang_pendukung,
        nama_barang: item.nama_barang,
        tipe_barang: item.tipe_barang_bp,
        nama_merk: item.merk_bp,
        id_ruangan: item.id_ruangan_bp,
        nama_ruangan: item.nama_ruangan_bp,
      },
      komputer: {
        id_komputer: item.id_komputer,
        nama_merk: item.nama_merk_k,
        tipe_barang: item.tipe_barang_k,
        id_ruangan: item.id_ruangan,
        nama_ruangan: item.nama_ruangan_k,
        urutan_meja: item.urutan_meja,
      },
      tgl_peminjaman: item.tgl_peminjaman,
      tgl_kembali: item.tgl_kembali,
      status_peminjaman: item.status_peminjaman,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    if (data) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: nestedData,
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

const getSingleDataPeminjamanBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const selectRuanganByIdQuery = `SELECT 
    pb.id,
    pb.peminjam,
    pb.instansi,
    pb.id_barang_pendukung,
    bp.nama_barang,
    m_bp.nama_merk AS merk_bp,
    tb_bp.tipe_barang AS tipe_barang_bp,
    bp.id_ruangan AS id_ruangan_bp,
    r_bp.nama_ruangan AS nama_ruangan_bp,
    pb.id_komputer,
    m_k.nama_merk AS nama_merk_k,
    tb_k.tipe_barang AS tipe_barang_k,
    k.id_ruangan,
    r_k.nama_ruangan AS nama_ruangan_k,
    k.urutan_meja,
    pb.tgl_peminjaman,
    pb.tgl_kembali,
    pb.status_peminjaman,
    pb.created_at,
    pb.updated_at
FROM peminjaman_barang pb
LEFT JOIN komputer k ON pb.id_komputer = k.id
LEFT JOIN barang_pendukung bp ON pb.id_barang_pendukung = bp.id
LEFT JOIN ruangan r_k ON k.id_ruangan = r_k.id
LEFT JOIN ruangan r_bp ON bp.id_ruangan = r_bp.id
LEFT JOIN tipe_barang tb_k ON k.id_tipe = tb_k.id
LEFT JOIN tipe_barang tb_bp ON bp.id_tipe_barang = tb_bp.id
LEFT JOIN merk m_k ON k.id_merk = m_k.id
LEFT JOIN merk m_bp ON bp.id_merk = m_bp.id
WHERE pb.id = ?`;
    const data = await new Promise((resolve, reject) => {
      db.query(selectRuanganByIdQuery, [id], function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
    const nestedData = data.map((item) => ({
      id: item.id,
      nama_peminjam: item.peminjam,
      instansi: item.instansi,
      barang_pendukung: {
        id_barang_pendukung: item.id_barang_pendukung,
        nama_barang: item.nama_barang,
        tipe_barang: item.tipe_barang_bp,
        nama_merk: item.merk_bp,
        id_ruangan: item.id_ruangan_bp,
        nama_ruangan: item.nama_ruangan_bp,
      },
      komputer: {
        id_komputer: item.id_komputer,
        nama_merk: item.nama_merk_k,
        tipe_barang: item.tipe_barang_k,
        id_ruangan: item.id_ruangan,
        nama_ruangan: item.nama_ruangan_k,
        urutan_meja: item.urutan_meja,
      },
      tgl_peminjaman: item.tgl_peminjaman,
      tgl_kembali: item.tgl_kembali,
      status_peminjaman: item.status_peminjaman,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    if (data.length !== 0) {
      res.status(200).send({
        code: 200,
        status: 'OK',
        data: nestedData[0],
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
const addDataPeminjamanBarang = async (req, res) => {
  try {
    let dataPeminjamanBarang = {
      peminjam: req.body.peminjam,
      instansi: req.body.instansi,
      id_barang_pendukung: parseInt(req.body.id_barang_pendukung) || null,
      id_komputer: parseInt(req.body.id_komputer) || null,
      tgl_peminjaman: req.body.tgl_peminjaman,
      tgl_kembali: req.body.tgl_kembali,
      status_peminjaman: req.body.status_peminjaman,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO peminjaman_barang SET ?;',
        [dataPeminjamanBarang],
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
        data: dataPeminjamanBarang,
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        errors: {
          id_ruangan: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Cek Kembali id',
          ],
          kegiatan: ['Tidak boleh kosong', 'Tidak boleh berisikan data null'],
          tanggal_peminjaman: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan format tanggal YYYY/MM/DD',
          ],
          tanggal_kembali: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan format tanggal YYYY/MM/DD',
          ],
          status_peminjaman: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
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
const editDataPeminjamanBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const editDataPeminjamanBarang = {
      peminjam: req.body.peminjam,
      instansi: req.body.instansi,
      id_barang_pendukung: parseInt(req.body.id_barang_pendukung) || null,
      id_komputer: parseInt(req.body.id_komputer) || null,
      tgl_peminjaman: req.body.tgl_peminjaman,
      tgl_kembali: req.body.tgl_kembali,
      status_peminjaman: req.body.status_peminjaman,
    };

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE peminjaman_barang SET ? WHERE id = ?;',
        [editDataPeminjamanBarang, id],
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
          ...editDataPeminjamanBarang,
        },
      });
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        errors: {
          id_ruangan: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Cek Kembali id',
          ],
          kegiatan: ['Tidak boleh kosong', 'Tidak boleh berisikan data null'],
          tanggal_peminjaman: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan format tanggal YYYY/MM/DD',
          ],
          tanggal_kembali: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan format tanggal YYYY/MM/DD',
          ],
          status_peminjaman: [
            'Tidak boleh kosong',
            'Tidak boleh berisikan data null',
            'Gunakan tipe data string',
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
const deleteDataPeminjamanBarang = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM peminjaman_barang WHERE id = ?;',
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

module.exports = {
  getDataPeminjamanBarang,
  getSingleDataPeminjamanBarang,
  addDataPeminjamanBarang,
  editDataPeminjamanBarang,
  deleteDataPeminjamanBarang,
};
