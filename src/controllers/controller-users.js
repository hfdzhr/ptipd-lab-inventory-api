const config = require('../configs/database');
const nodemailer = require('nodemailer');
const util = require('util');
const jwt = require('jsonwebtoken');
const { log } = require('console');
const db = require('../configs/db.config');

// Register data User Baru
const registerDataUser = async (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password,
    is_verified: 0,
    instansi: req.body.instansi,
    name: req.body.name,
    role: req.body.role,
  };

  const verificationToken = generateToken();

  try {
    // Periksa Apakah Email sudah terdaftar atau belum di dalam database
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
              // Email sudah terdaftar, kirimkan respons yang sesuai
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
  } catch (error) {
    console.error('Gagal mendaftar : ' + error.message);
    res.status(500).json({ message: 'Gagal mendaftar' });
  }
};

function generateJWTToken(userId) {
  const secretKey = '1234';
  const expiresIn = '3d';

  const token = jwt.sign({ userId }, secretKey, { expiresIn });

  return token;
}

const loginDataUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?;',
        [email, password],
        function (error, rows) {
          if (error) {
            reject(error);
          } else {
            resolve(rows[0]);
          }
        }
      );
    });

    if (user) {
      const token = generateJWTToken(user.id_user);
      res.status(200).json({
        code: 200,
        status: 'OK',
        data: {
          profile: {
            id: user.id_user,
            name: user.name,
            email: user.email,
            instansi: user.instansi,
            role: user.role,
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

// const deleteDataUser = asyns (req, res) => {
//   const id_user = req.params.id
// }

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
    text: `Klik tautan berikut untuk verifikasi email Anda: http://localhost:3000/users/verify/${token}`,
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

  const query = util.promisify(db.query).bind(connection);

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

function checkRole(role) {
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

          if (userRole === role && userIsVerifed === 1) {
            next();
          } else if (userRole === role && userIsVerifed === 0) {
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
  loginDataUser,
  VerifyUser,
  checkRole,
};
