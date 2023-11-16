const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const FileUpload = require('express-fileupload');
const port = process.env.PORT || 3000;
// Definisi environtmen secara global (.env)
require('dotenv').config();

// Convert data ke JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(FileUpload());
app.use(express.static('public'));

// Memanggil route karyawan
const appRoute = require('./src/routers');
const fileUpload = require('express-fileupload');
app.use('/', appRoute);

// Menjalankan server sesuai dengan port yang terdaftar di .env (8080)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server Berjalan ${process.env.URL_HOST}`);
});
