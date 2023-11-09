// Fungsi untuk memeriksa dan menghapus token JWT
function checkAndDeleteToken() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJpYXQiOjE2OTk0MjQ2OTAsImV4cCI6MTY5OTY4Mzg5MH0.PGh1iR-6L4_mPmB8VH1NPwwy0TJswB5W1LMjME-tOJw' // Mengambil token dari penyimpanan lokal (localStorage)

  if (token) {
      const decodedToken = parseJwt(token); // Fungsi untuk mendekode token (perlu diimplementasikan)
      const currentTimestamp = Math.floor(Date.now() / 1000); // Timestamp saat ini dalam detik
      
      if (decodedToken.exp < currentTimestamp) {
          // Jika token sudah kedaluwarsa, hapus token dari penyimpanan lokal
          alert('Token sudah kedaluwarsa. Harap login ulang.');
          // Tambahkan logika lainnya seperti redireksi ke halaman login
      } 
  }
}

// Fungsi untuk mendekode token JWT (contoh sederhana)
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64));
  return JSON.parse(jsonPayload);
}

// Memanggil fungsi untuk memeriksa token saat aplikasi dimuat
checkAndDeleteToken();
