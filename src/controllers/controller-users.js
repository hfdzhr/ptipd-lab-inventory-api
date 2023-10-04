const config = require('../configs/database');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const connection = mysql.createConnection(config);
const util = require('util');
const jwt = require('jsonwebtoken');
connection.connect();

// Register data User Baru
const registerDataUser = async (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password,
    is_verified: 0,
    instansi: req.body.instansi,
    name: req.body.name,
  };

  const verificationToken = generateToken();

  try {
    // Memeriksa apakah email sudah terdaftar
    await new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM users WHERE email = ?',
        data.email,
        function (error, rows) {
          if (error) {
            console.error('Gagal mendaftar : ' + error.message);
            res.status(500).json({ status: 500, message: 'Gagal mendaftar' });
          } else {
            if (rows.length > 0) {
              // Email sudah terdaftar, kirimkan respons yang sesuai
              res
                .status(400)
                .json({ status: 400, message: 'Email sudah terdaftar' });
            } else {
              // Email belum terdaftar, lanjutkan dengan pendaftaran
              connection.query(
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
                      status: 200,
                      message:
                        'Registrasi berhasil silahkan cek email Anda untuk verifikasi',
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
  const expiresIn = '1h';

  const token = jwt.sign({ userId }, secretKey, { expiresIn });

  return token;
}

const loginDataUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await new Promise((resolve, reject) => {
      connection.query(
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
      const token = generateJWTToken(user.id);

      res
        .status(200)
        .json({
          status: 200,
          profile: [
            { name: user.name, email: user.email, instansi: user.instansi },
          ],
          message: 'Selamat Login Berhasil',
          token,
        });
    } else {
      res.status(401).json({
        status: 401,
        message: 'Login gagal silah periksa email dan password anda kembali',
      });
    }
  } catch (error) {
    console.error(`Gagal Login: ${error.message}`);
    res.status(500).json({ status: 500, message: 'Gagal Login' });
  }
};


async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'hafidgamers11@gmail.com',
      pass: 'rkjsojywcznfusos',
    },
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Server is ready to take our messages');
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: 'hafidgamers11@gmail.com',
    to: email,
    subject: 'Verifikasi Email',
    text: `Klik tautan berikut untuk verifikasi email Anda: http://localhost:3000/users/verify/${token}`,
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });

  res.status(200).json({ status: 'OK' });
};


// Melakukan penggantian sudah verifikasi atau belum
const VerifyUser = async (req, res) => {
  const token = req.params.token;

  const query = util.promisify(connection.query).bind(connection);

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

module.exports = {
  registerDataUser,
  loginDataUser,
  VerifyUser,
};
