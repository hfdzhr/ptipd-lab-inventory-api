const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.APP_PORT || 3000;
// Definisi environtmen secara global (.env)
require('dotenv').config();

// Convert data ke JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Memanggil route karyawan
const appRoute = require('./src/routers');
app.use('/', appRoute);

// Menjalankan server sesuai dengan port yang terdaftar di .env (8080)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server Berjalan http://localhost:${process.env.APP_PORT}`);
});
