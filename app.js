const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// Definisi environtmen secara global (.env)
require('dotenv').config();

// Convert data ke JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Memanggil route karyawan
const appRoute = require('./src/routers');
app.use('/', appRoute);

// Menjalankan server sesuai dengan port yang terdaftar di .env (8080)
app.listen(process.env.APP_PORT, () => {
  console.log(`Server Berjalan http://localhost:${process.env.APP_PORT}`);
});
