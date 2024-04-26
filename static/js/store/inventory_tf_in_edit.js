// Import library & function yg dibutuhkan
import { BaseUrl, UrlGetTransferInById, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";

// Pengkondisian ketika klik button Received
document.getElementById("receivedButton").addEventListener("click", function() {
    // Menampilkan SweetAlert konfirmasi
    Swal.fire({
        title: 'Received Transfer In?',
        text: "Apakah kamu yakin akan received transfer in?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, yakin!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
            window.location.href = `inventory_tf_in_received.html?id=${id}`;
        }
    });
});

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetTransferInById = BaseUrl + UrlGetTransferInById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;

// Fetch data from API endpoint
fetch(GetTransferInById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    const contactId = data.data.contact_id;
    const  warehouseId = data.data.warehouse_id;
            
    // Fetch data kontak
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
    document.getElementById('stokRoll').value = data.data.stock_roll;
    document.getElementById('stokKg').value = data.data.stock_kg;
    document.getElementById('stokRib').value = data.data.stock_rib;
    document.getElementById('gradeInput').value = data.data.grade;
    document.getElementById('skuInput').value = data.data.sku;
    document.getElementById('tanggalInput').value = data.data.date;
    document.getElementById('deskripsiInput').value = data.data.description;
})
.catch(error => console.error('Error:', error));

