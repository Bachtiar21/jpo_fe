// Import library & function yg dibutuhkan
import { BaseUrl, UrlGetByIdPurchaseOrder, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet, UrlPutPurchaseOrder } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetPurchaseOrderById = BaseUrl + UrlGetByIdPurchaseOrder + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;
const PutPurchaseOrder = BaseUrl + UrlPutPurchaseOrder + `/${id}`;

let purchaseData;

// Fetch data from API endpoint
fetch(GetPurchaseOrderById, requestOptionsGet)
    .then(response => response.json())
    .then(data => {
        const contactId = data.data.contact_id;
        const warehouseId = data.data.warehouse_id;
        purchaseData = data.data;
                
        // Fetch data Purchase Order
        fetch(GetContactById + `/${contactId}`, requestOptionsGet)
            .then(response => response.json())
            .then(contactData => {
                if (contactData && contactData.data) {
                    const contactName = contactData.data.name;
                    document.getElementById("listVendor").value = contactName;
                }
        });
        // Fetch data Warehouse
        fetch(GetWarehouseByIdByToken + `/${warehouseId}`, requestOptionsGet)
        .then(response => response.json())
        .then(warehouseData => {
            if (warehouseData && warehouseData.data) {
                const warehouseName = warehouseData.data.name;
                document.getElementById("listWarehouse").value = warehouseName;
            }
        });
        // Populate form fields with data
        document.getElementById('nomorDoInput').value = data.data.no_do;
        document.getElementById('namaBarangInput').value = data.data.nama_barang;
        document.getElementById('ketebalanInput').value = data.data.ketebalan;
        document.getElementById('settingInput').value = data.data.setting;
        document.getElementById('gramasiInput').value = data.data.gramasi;
        document.getElementById('stockRollInput').value = data.data.stock_roll;
        document.getElementById('stockKgInput').value = data.data.stock_kg;
        document.getElementById('stockRibInput').value = data.data.stock_rib;
        document.getElementById('gradeInput').value = data.data.grade;
        document.getElementById('skuInput').value = data.data.sku;
        document.getElementById('tanggalInput').value = data.data.date;
        document.getElementById('deskripsiInput').value = data.data.description;
        document.getElementById('hargaInput').value = data.data.price;

    })
    .catch(error => console.error('Error:', error));

// Update Data Purchase Order
// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {

    const namaBarangInput = document.getElementById('namaBarangInput').value;
    const ketebalanInput = document.getElementById('ketebalanInput').value;
    const settingInput = document.getElementById('settingInput').value;
    const gramasiInput = document.getElementById('gramasiInput').value;
    const stockRollInput = document.getElementById('stockRollInput').value;
    const stockKgInput = document.getElementById('stockKgInput').value;
    const stockRibInput = document.getElementById('stockRibInput').value;
    const gradeInput = document.getElementById('gradeInput').value;
    const skuInput = document.getElementById('skuInput').value;
    const tanggalInput = document.getElementById('tanggalInput').value;
    const deskripsiInput = document.getElementById('deskripsiInput').value;
    const hargaInput = document.getElementById('hargaInput').value;

    const updatedData = {
        nama_barang: namaBarangInput,
        ketebalan: ketebalanInput,
        setting: settingInput,
        gramasi: gramasiInput,
        stock_roll: stockRollInput,
        stock_kg: stockKgInput,
        stock_rib: stockRibInput,
        grade: gradeInput,
        sku: skuInput,
        date: tanggalInput,
        description: deskripsiInput,
        price: hargaInput,
    };
    
    if (isDataChanged(purchaseData, updatedData)) {
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
        existingData.stock_roll !== newData.stock_roll ||
        existingData.stock_kg !== newData.stock_kg ||
        existingData.stock_rib !== newData.stock_rib ||
        existingData.grade !== newData.grade ||
        existingData.sku !== newData.sku ||
        existingData.date !== newData.date ||
        existingData.description !== newData.description ||
        existingData.price !== newData.price
    );
}

// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
    Swal.fire({
        title: 'Perubahan Data Purchase Order',
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
                const updatedData = { ...data, token_update: tokenUpdate };
                updatePurchaseOrder(updatedData);
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
                text: 'Perubahan Data Purchase Order Dibatalkan!',
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
function updatePurchaseOrder(data) {
    fetch(PutPurchaseOrder, {
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
            text: 'Data Purchase Order Berhasil Diperbarui',
            showConfirmButton: false,
            timer: 1500
        })
        .then(() => {
            window.location.href = 'purchase_po_view.html';
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
                text: 'Gagal memperbarui data Purchase Order!',
            });
        }
    });
}