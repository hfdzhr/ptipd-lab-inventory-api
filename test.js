const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Konfigurasi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'nama_database',
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal: ' + err.message);
  } else {
    console.log('Terhubung ke database MySQL');
  }
});

// Middleware untuk parsing JSON
app.use(express.json());

// Rute untuk mendaftar pengguna
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash kata sandi

    // Simpan pengguna ke database
    db.query(
      'INSERT INTO users (email, password, is_verified) VALUES (?, ?, ?)',
      [email, hashedPassword, false],
      (error, results) => {
        if (error) {
          console.error('Gagal mendaftar: ' + error.message);
          res.status(500).json({ message: 'Gagal mendaftar' });
        } else {
          // Kirim email verifikasi
          const verificationToken = generateToken(); // Buat token verifikasi unik
          sendVerificationEmail(email, verificationToken);

          res
            .status(200)
            .json({
              message: 'Registrasi berhasil, cek email Anda untuk verifikasi.',
            });
        }
      }
    );
  } catch (error) {
    console.error('Terjadi kesalahan: ' + error.message);
    res.status(500).json({ message: 'Terjadi kesalahan' });
  }
});

// Fungsi untuk mengirim email verifikasi
function sendVerificationEmail(email, token) {
  // Konfigurasi transporter Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your.email@gmail.com',
      pass: 'your-email-password',
    },
  });

  // Konfigurasi email
  const mailOptions = {
    from: 'your.email@gmail.com',
    to: email,
    subject: 'Verifikasi Email',
    text: `Klik tautan berikut untuk verifikasi email Anda: http://localhost:3000/verify/${token}`,
  };

  // Kirim email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Gagal mengirim email verifikasi: ' + error.message);
    } else {
      console.log('Email verifikasi berhasil dikirim: ' + info.response);
    }
  });
}

// Fungsi untuk memverifikasi email
app.get('/verify/:token', (req, res) => {
  const token = req.params.token;

  // Verifikasi token di database
  db.query(
    'UPDATE users SET is_verified = ? WHERE verification_token = ?',
    [true, token],
    (error, results) => {
      if (error) {
        console.error('Gagal memverifikasi email: ' + error.message);
        res.status(500).send('Gagal memverifikasi email');
      } else {
        res.send('Email berhasil diverifikasi');
      }
    }
  );
});

// Menghasilkan token verifikasi acak (ganti ini dengan pustaka token yang lebih aman)
function generateToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
