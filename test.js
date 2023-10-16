const BASE_URL = 'http://localhost:3000';

fetch(`${BASE_URL}/ruangan`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.data.forEach((i) => {
      console.log(`Kode ruangan : ${i.id}, Nama Ruangan : ${i.nama_ruangan}, Jumlah Komputer : ${i.jumlah_komputer_laptop}`);
    });
  })
  .catch(function () {});
