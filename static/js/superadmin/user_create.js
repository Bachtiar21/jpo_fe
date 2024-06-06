import {
  BaseUrl,
  UrlPostUser,
  UrlGetAllConvection,
  UrlGetAllStore,
  requestOptionsGet,
} from "../controller/template.js";
import { token } from "../controller/cookies.js";

// Ambil elemen-elemen yang diperlukan dari DOM
const selectTokoPabrik = document.getElementById("selectTokoPabrik");
const superAdminCheckbox = document.getElementById("superAdmin");
const storeSelect = document.getElementById("listStoreSelect");
const convectionSelect = document.getElementById("listConvectionSelect");

// Create Url Post
const PostUser = BaseUrl + UrlPostUser;
const GetAllStore = BaseUrl + UrlGetAllStore;
const GetAllConvection = BaseUrl + UrlGetAllConvection;

// Listener untuk dropdown Toko/Pabrik
document.addEventListener("DOMContentLoaded", function () {
  // Ambil elemen dropdown
  const selectTokoPabrik = document.getElementById("selectTokoPabrik");

  // Ambil elemen inputan Store dan Convection
  const listStore = document.getElementById("listStore");
  const listConvection = document.getElementById("listConvection");

  // Semua inputan disembunyikan terlebih dahulu saat halaman dimuat
  listStore.hidden = true;
  listConvection.hidden = true;

  // Tambahkan event listener untuk dropdown
  selectTokoPabrik.addEventListener("change", function () {
    // Ambil nilai yang dipilih
    const selectedOption = selectTokoPabrik.value;

    // Semua inputan disembunyikan terlebih dahulu
    listStore.hidden = true;
    listConvection.hidden = true;

    // Tampilkan inputan yang sesuai dengan pilihan
    if (selectedOption === "store") {
      listStore.hidden = false;
    } else if (selectedOption === "convection") {
      listConvection.hidden = false;
    }
  });
});

// Listener untuk interaksi button is super admin
document.addEventListener("DOMContentLoaded", function () {
  // Listener untuk interaksi button is super admin
  document.getElementById("superAdmin").addEventListener("click", function () {
    // Ambil elemen inputan Store dan Convection
    const tokoPabrik = document.getElementById("tokoPabrik");

    // Cek apakah inputan toko/pabrik sudah disembunyikan
    if (tokoPabrik.hidden) {
      // Jika sudah disembunyikan, tampilkan kembali
      tokoPabrik.hidden = false;
    } else {
      // Jika belum disembunyikan, sembunyikan
      tokoPabrik.hidden = true;
    }
  });
});

// Untuk Fetch Data di dropdown Store
const listStoreSelect = document.getElementById("listStoreSelect");
fetch(GetAllStore, requestOptionsGet)
  .then((response) => response.json())
  .then((data) => {
    // Periksa jika pesan adalah 'success fetch Stores'
    if (data.Message === "success fetch Stores") {
      // Loop melalui data toko dan tambahkan opsi ke elemen dropdown
      data.data.forEach((store) => {
        const option = document.createElement("option");
        option.value = store.id;
        option.text = store.name;
        listStoreSelect.appendChild(option);
      });
    } else {
      console.error("Gagal mengambil data toko.");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Untuk Fetch Data di dropdown Convection
const listConvectionSelect = document.getElementById("listConvectionSelect");
fetch(GetAllConvection, requestOptionsGet)
  .then((response) => response.json())
  .then((data) => {
    // Periksa jika pesan adalah 'success fetch Convections'
    if (data.Message === "success fetch Convections") {
      // Loop melalui data toko dan tambahkan opsi ke elemen dropdown
      data.data.forEach((convection) => {
        const option = document.createElement("option");
        option.value = convection.id;
        option.text = convection.name;
        listConvectionSelect.appendChild(option);
      });
    } else {
      console.error("Gagal mengambil data pabrik.");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Untuk Melakukan Post User
// Tambahkan event listener untuk tombol Simpan
document.getElementById("submitButton").addEventListener("click", function () {
  // Ambil nilai dari elemen-elemen input
  const name = document.getElementById("fullNameInput").value;
  const phoneNumber = document.getElementById("noHpInput").value;
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;
  const role = superAdminCheckbox.checked
    ? "superadmin"
    : selectTokoPabrik.value;
  const storeId = role === "store" ? storeSelect.value : null;
  const convectionId = role === "convection" ? convectionSelect.value : null;

  // Tampilkan alert konfirmasi menggunakan SweetAlert
  Swal.fire({
    title: "Konfirmasi",
    text: "Apakah Anda yakin ingin membuat user ini",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  }).then((result) => {
    // Jika pengguna menekan tombol Ya
    if (result.isConfirmed) {
      // Lakukan permintaan HTTP POST ke endpoint yang ditentukan
      fetch(PostUser, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          phone_number: phoneNumber,
          username: username,
          roles: role,
          password: password,
          store_id: storeId,
          convection_id: convectionId,
        }),
      })
        .then((response) => {
          // Periksa status respons
          if (response.ok) {
            // Tampilkan alert sukses menggunakan SweetAlert
            Swal.fire({
              title: "Sukses!",
              text: "Data user berhasil disimpan.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = "user_view.html";
            });
          } else {
            // Tampilkan alert kesalahan menggunakan SweetAlert
            Swal.fire({
              title: "Error!",
              text: "Terjadi kesalahan saat menyimpan data user.",
              icon: "error",
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Tampilkan alert kesalahan menggunakan SweetAlert
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan saat menyimpan data user.",
            icon: "error",
          });
        });
    }
  });
});
