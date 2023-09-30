const config = require('../configs/database');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const connection = mysql.createConnection(config);
const util = require('util');
connection.connect();

// Register data User Baru
const registerDataUser = async (req, res) => {
  let data = {
    email: req.body.email,
    password: req.body.password,
    is_verified: 0,
  };

  const verificationToken = generateToken();

  try {
    // Mengirim email verifikasi ke pendaftar
    await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO users SET ?',
        { ...data, verification_token: verificationToken },
        function (error, rows) {
          if (error) {
            console.error('Gagal mendaftar : ' + error.message);
            res.status(500).json({ message: 'Gagal mendaftar' });
          } else {
            sendVerificationEmail(data.email, verificationToken);
            res.status(200).json({
              message:
                'Registrasi berhasil silahkan cek email Anda untuk verifikasi',
            });
          }
        }
      );
    });
  } catch (error) {
    console.error('Gagal mendaftar : ' + error.message);
    res.status(500).json({ message: 'Gagal mendaftar' });
  }
};

function sendVerificationEmail(email, token) {
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

  const mailOptions = {
    from: 'hafidgamers11@gmail.com',
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
  VerifyUser,
};
