import { BaseUrl, UrlGetStockAllById, UrlPutStock, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetStockAllById = BaseUrl + UrlGetStockAllById + `/${id}`;
const PutStock = BaseUrl + UrlPutStock + `/${id}`;

let stockData;

// Fetch data from API endpoint
fetch(GetStockAllById, requestOptionsGet)
.then(response => response.json())
.then(responseData => {
    const data = responseData.data;
    stockData = responseData.data;
    if (data) {
        document.getElementById('namaBarangInput').value = data.nama_barang;
        document.getElementById('ketebalanInput').value = data.ketebalan;
        document.getElementById('settingInput').value = data.setting;
        document.getElementById('gramasiInput').value = data.gramasi;
        document.getElementById('gradeInput').value = data.grade;
        document.getElementById('hargaJualInput').value = data.price;
        document.getElementById('deskripsiInput').value = data.description;
    } else {
        console.error('Data not found');
    }
})
.catch(error => console.error('Error:', error));

// Update Data Stock
// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {

    const namaBarangInput = document.getElementById('namaBarangInput').value;
    const ketebalanInput = document.getElementById('ketebalanInput').value;
    const settingInput = document.getElementById('settingInput').value;
    const gramasiInput = document.getElementById('gramasiInput').value;
    const gradeInput = document.getElementById('gradeInput').value;
    const deskripsiInput = document.getElementById('deskripsiInput').value;
    const hargaInput = document.getElementById('hargaJualInput').value;

    const updatedData = {
        nama_barang: namaBarangInput,
        ketebalan: ketebalanInput,
        setting: settingInput,
        gramasi: gramasiInput,
        grade: gradeInput,
        description: deskripsiInput,
        price: hargaInput,
    };
    
    if (isDataChanged(stockData, updatedData)) {
        showConfirmationAlert(updatedData);
    } else {
        showNoChangeAlert();
    }
});

// Fungsi untuk membandingkan apakah ada perubahan pada data
function isDataChanged(existingData, newData) {
    return (
        existingData.nama_barang !== newData.nama_barang ||
        existingData.ketebalan !== newData.ketebalan ||
        existingData.setting !== newData.setting ||
        existingData.gramasi !== newData.gramasi ||
        existingData.grade !== newData.grade ||
        existingData.description !== newData.description ||
        existingData.price !== newData.price
    );
}

// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
    Swal.fire({
        title: 'Perubahan Data Stock',
        html:
        `<input type="text" id="tokenUpdateInput" class="swal2-input" placeholder="Masukkan token update">`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        preConfirm: () => {
            const tokenUpdate = document.getElementById('tokenUpdateInput').value;
            if (!tokenUpdate) {
                Swal.showValidationMessage('Token update harus diisi');
            }
            return { tokenUpdate: tokenUpdate };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const tokenUpdate = result.value.tokenUpdate;
            if (tokenUpdate) {
                const updatedData = { ...data, update_key: tokenUpdate };
                updateStock(updatedData);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Token update harus diisi!',
                });
            }
        } else {
            // Menampilkan Data Alert Error
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Perubahan Data Stock Dibatalkan!',
            });
        }
    });
}

// Function untuk Alert Error
function showNoChangeAlert() {
    Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text : 'Tidak Ada Perubahan Data'
    });
}
// Function Fetch Endpoint Put
function updateStock(data) {
    fetch(PutStock, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Token sudah digunakan');
        }
        return response.json();
    })
    .then(responseData => {
        // Handle successful response here
        console.log('Response:', responseData);
        // Menampilkan Data Alert Success
        Swal.fire({
            icon: 'success',
            title: 'Sukses!',
            text: 'Data Stock Berhasil Diperbarui',
            showConfirmButton: false,
            timer: 1500
        })
        .then(() => {
            window.location.href = 'inventory_stc_view.html';
        })
    })
    .catch(error => {
        console.error("Error saat melakukan PUT data:", error);
        // Handle specific error message
        if (error.message === 'Token sudah digunakan') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Token sudah digunakan!',
            });
        } else {
            // Handle other errors
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal memperbarui data Stock!',
            });
        }
    });
}