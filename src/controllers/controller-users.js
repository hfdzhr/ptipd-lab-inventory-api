const nodemailer = require('nodemailer');
const util = require('util');
const jwt = require('jsonwebtoken');
const db = require('../configs/db.config');
const argon2 = require('argon2');
const validator = require('validator');
const cron = require('node-cron');
const { log } = require('util');

// Register data User Baru
const registerDataUser = async (req, res) => {
  try {
    const hashedPassword = await argon2.hash(req.body.password);
    const data = {
      email: req.body.email,
      password: hashedPassword,
      is_verified: 0,
      instansi: req.body.instansi,
      name: req.body.name,
      role: req.body.role || 'user',
    };
    const verificationToken = generateToken();

    const isValidEmail = await validator.isEmail(data.email);

    if (isValidEmail) {
      await new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM users WHERE email = ?',
          data.email,
          function (error, rows) {
            if (error) {
              console.error('Gagal mendaftar : ' + error.message);
              res.status(500).json({
                code: 500,
                status: 'INTERNAL_SERVER_ERROR',
                errors: [
                  'Gagal Mendafatar',
                  'Terjadi kesalan pada server',
                  'Server sedang maintenance',
                  'Server sedang penuh, mohon tunggu sebentar',
                ],
              });
            } else {
              if (rows.length > 0) {
                // Email sudah terdaftar dan sudah diverifikasi, kirimkan respons yang sesuai
                res.status(400).json({
                  code: 400,
                  status: 'BAD_REQUEST',
                  errors: {
                    email: [
                      'Email sudah terdaftar',
                      'Email yang didaftar sudah tersedia',
                      'Ganti alamat email anda',
                      'Periksa kembali alamat email anda',
                    ],
                  },
                });
              } else {
                // Email belum terdaftar, lanjutkan dengan pendaftaran
                db.query(
                  'INSERT INTO users SET ?',
                  { ...data, verification_token: verificationToken },
                  function (error, rows) {
                    if (error) {
                      console.error('Gagal mendaftar : ' + error.message);
                      res
                        .status(500)
                        .json({ status: 500, message: 'Gagal mendaftar' });
                    } else {
                      sendVerificationEmail(data.email, verificationToken);
                      res.status(200).json({
                        code: 200,
                        status: 'OK',
                        data: {
                          message:
                            'Registrasi berhasil silahkan cek email Anda untuk verifikasi',
                        },
                      });
                    }
                  }
                );
              }
            }
          }
        );
      });
    } else {
      res.status(400).json({
        code: 400,
        status: 'BAD_REQUEST',
        message: 'Email tidak sesuai periksa kembali email',
      });
    }
    // Periksa Apakah Email sudah terdaftar atau belum di dalam database
  } catch (error) {
    console.error('Gagal mendaftar : ' + error.message);
    res.status(500).json({ message: 'Gagal mendaftar' });
  }
};

// Ambil Data Users
const getDataUsers = async (req, res) => {
  // const tipe = req.query.tipe || 0;
  // const kondisi = req.query.kondisi || 0;
  // const page = parseInt(req.query.page) || 0;
  // const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || '';

  const totalRows = await new Promise((resolve, reject) => {
    const countUser = `SELECT
    COUNT(*)
  FROM
    users u
  WHERE 
    name LIKE ? OR instansi LIKE ?;`;

    db.query(countUser, [`%${search}%`, `%${search}%`], function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows[0]['COUNT(*)']);
      }
    });
  });

  const data = await new Promise((resolve, reject) => {
    let getJadwalMaintenanceQuery = `
    SELECT
	u.id_user,
	u.name,
	u.email,
	u.instansi,
	u.role
FROM
	users u
WHERE
	u.name LIKE ? OR u.instansi LIKE ? OR u.email LIKE ? OR u.role LIKE ?;`;

    db.query(
      getJadwalMaintenanceQuery,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
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
    });
  } else {
    res.send({
      code: 400,
      status: 'BAD_REQUEST',
    });
  }
};

// Mengedit Data User
const editDataUsers = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = {
      email: req.body.email,
      name: req.body.name,
      instansi: req.body.instansi,
      role: req.body.role,
    };

    const isValidEmail = await validator.isEmail(data.email);

    if (isValidEmail) {
      const result = await new Promise((resolve, reject) => {
        let queryEditDataUsers = `UPDATE users SET ? WHERE id_user = ?;`;

        db.query(queryEditDataUsers, [data, id], function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        });
      });

      if (result) {
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
    } else {
      res.status(400).json({
        code: 400,
        status: 'BAD_REQUEST',
        message: 'Email tidak sesuai periksa kembali email',
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

// Menghapus Data Users
const deleteDataUsers = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await new Promise((resolve, reject) => {
      let queryDeleteDataUsers = `DELETE FROM users WHERE id_user = ?;`;

      db.query(queryDeleteDataUsers, [id], function (error, rows) {
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
        deleted_data_id: id,
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

// Reset Password
const resetPasswordUsers = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const dataResetPasswordUser = {
      password: req.body.password,
      retypePassword: req.body.retype_password,
    };

    const { password, retypePassword } = dataResetPasswordUser;

    // Verifikasi Password dan Retype Password
    if (password === retypePassword) {
      const hashedPassword = await argon2.hash(password);

      const result = await new Promise((resolve, reject) => {
        let queryResetPasswordUsers = `UPDATE users SET password = ? WHERE id_user = ?;`;

        db.query(
          queryResetPasswordUsers,
          [hashedPassword, id],
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
          updated_data_id: id,
        });
      } else {
        res.status(400).send({
          code: 400,
          status: 'BAD_REQUEST',
        });
      }
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        error: 'Password dan Ulangi Password tidak sama silahkan cek kembali',
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

function generateJWTToken(userId) {
  const secretKey = '1234';
  const expiresIn = '3d';

  const token = jwt.sign({ userId }, secretKey, { expiresIn });

  return token;
}

const loginDataUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const isValidEmail = await validator.isEmail(email);

    if (isValidEmail) {
      const user = await new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM users WHERE email = ?',
          [email],
          function (error, rows) {
            if (error) {
              reject(error);
            } else {
              if (rows.length === 0) {
                res.status(401).send({
                  code: 401,
                  status: 'UNAUTHORIZED',
                  error: 'Email yang dimasukan tidak terdaftar',
                });
              } else {
                resolve(rows);
              }
            }
          }
        );
      });

      const hashedPasswordFromDB = user[0].password;

      const isPasswordValid = await argon2.verify(
        hashedPasswordFromDB,
        password
      );

      if (user.length > 0 && isPasswordValid) {
        const token = generateJWTToken(user[0].id_user);
        res.status(200).json({
          code: 200,
          status: 'OK',
          data: {
            profile: {
              id: user[0].id_user,
              name: user[0].name,
              email: user[0].email,
              instansi: user[0].instansi,
              role: user[0].role,
            },
            message: 'Selamat Login Berhasil',
            token,
          },
        });
      } else {
        res.status(401).json({
          code: 401,
          status: 'UNAUTHORIZED',
          errors: {
            email: [
              'Silahkan masukan email dengan benar',
              'Pastikan email telah terdaftar',
              'Periksa kembali email',
              'Silahkan register jika belum mempunyai akun',
              'Perhatikan huruf besar dan juga kecil',
            ],
            password: [
              'Silahkan masukan password dengan benar',
              'Periksa kembali password',
              'Silahkan register jika belum mempunyai akun',
              'Perhatikan huruf besar dan juga kecil',
            ],
          },
        });
      }
    } else {
      res.status(400).send({
        code: 400,
        status: 'BAD_REQUEST',
        error: 'Email tidak sesuai periksa kembali email',
      });
    }
  } catch (error) {
    console.error(`Gagal Login: ${error.message}`);
    res.status(500).json({
      code: 500,
      status: 'INTERNAL_SERVER_ERROR',
      errors: [
        'Terjadi kesalan pada server',
        'Server sedang maintenance',
        'Server sedang penuh, mohon tunggu sebentar',
      ],
    });
  }
};

const middleware = (mail, callback) => {
  setTimeout(() => {
    callback(null, mail);
  }, delay);
};

function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_TRANSPORT,
      pass: process.env.PASSWORD_TRANSPORT,
    },
  });

  transporter.use(middleware);

  const mailOptions = {
    from: process.env.EMAIL_TRANSPORT,
    to: email,
    subject: 'Verifikasi Email',
    text: `Klik tautan berikut untuk verifikasi email Anda: ${process.env.URL_HOST}/users/verify/${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Gagal mengirim email verifikasi: ' + error.message);
    } else {
      console.log('Email verifikasi berhasil dikirim: ' + info.response);
    }
  });
}

// Melakukan penggantian sudah verifikasi atau belum
const VerifyUser = async (req, res) => {
  const token = req.params.token;

  const query = util.promisify(db.query).bind(db);

  try {
    await query(
      'UPDATE users SET is_verified = ? WHERE verification_token = ?',
      [1, token]
    );
    res.send('Email berhasil diverifikasi');
  } catch (error) {
    console.error('Gagal memverifikasi email: ' + error.message);
    res.status(500).send('Gagal memverifikasi email');
  }
};

// Men-Generate token untuk disimpan di database
function generateToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Function Checkrole
function checkRole(allowedRoles) {
  return (req, res, next) => {
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader) {
      // Token tidak ada dalam header
      return res.status(403).json({
        code: 403,
        status: 'FORBIDDEN',
        error: 'Token tidak ditemukan.',
      });
    }

    const tokenParts = tokenHeader.split(' ');

    jwt.verify(tokenParts[1], '1234', (err, decoded) => {
      if (err) {
        return res.status(403).json({
          code: 403,
          status: 'FORBIDDEN',
          error: 'Token tidak valid.',
        });
      }
      const userId = decoded.userId;

      // Query database untuk mendapatkan peran pengguna
      db.query(
        'SELECT role, is_verified, email FROM users WHERE id_user = ?',
        [userId],
        (err, results) => {
          if (err) {
            return res.status(500).json({
              code: 500,
              status: 'INTERNAL_SERVER_ERROR',
              message: 'Terjadi kesalahan pada server.',
            });
          }
          const userRole = results[0].role;
          const userIsVerifed = parseInt(results[0].is_verified);
          const emailUser = results[0].email;

          // Mengecek apakah peran pengguna termasuk dalam peran yang diizinkan
          if (allowedRoles.includes(userRole) && userIsVerifed === 1) {
            next();
          } else if (allowedRoles.includes(userRole) && userIsVerifed === 0) {
            return res.status(403).json({
              code: 403,
              status: 'FORBIDDEN',
              message: `Anda belum terverifikasi silahkan cek email ${emailUser} anda`,
            });
          } else {
            return res.status(403).json({
              code: 403,
              status: 'FORBIDDEN',
              message: 'Anda tidak memiliki izin untuk mengakses ini.',
            });
          }
        }
      );
    });
  };
}


module.exports = {
  registerDataUser,
  getDataUsers,
  editDataUsers,
  deleteDataUsers,
  resetPasswordUsers,
  loginDataUser,
  VerifyUser,
  checkRole,
};
