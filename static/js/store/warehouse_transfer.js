import { BaseUrl, UrlGetWarehouseByLogged, UrlGetWarehouseById, UrlWarehouseTransfer, requestOptionsGet } from "../controller/template.js";

import { token } from "../controller/cookies.js";

const GetWarehouseByLogged = BaseUrl + UrlGetWarehouseByLogged;
const GetWarehouseById = BaseUrl + UrlGetWarehouseById;
const WarehouseTransfer = BaseUrl + UrlWarehouseTransfer;

// Fetch Data di Dropdown
const dropdownTo = document.getElementById("listTo");
// Fetch data dari API
fetch(GetWarehouseByLogged, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((warehouse) => {
            const option = document.createElement("option");
            option.value = warehouse.id;
            option.textContent = warehouse.name;
            dropdownTo.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching contacts:', error);
});

// Inputan SKU dan From
const url = window.location.href;
const queryString = url.split('?')[1];
const params = new URLSearchParams(queryString);
const idWarehouse = params.get('id_warehouse');

fetch(GetWarehouseById + `/${idWarehouse}`, requestOptionsGet)
.then(response => response.json())
.then(warehouseData => {
    if (warehouseData && warehouseData.data) {
        const warehouseName = warehouseData.data.name;
        document.getElementById("fromInput").value = warehouseName;
    }
});

const queryStringSku = url.split('?')[2];
const paramsSku = new URLSearchParams(queryStringSku);
const sku = paramsSku.get('sku');
document.getElementById("skuInput").value = sku;

// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
    // Get input values
    const skuInput = document.getElementById('skuInput').value;
    const fromInput = idWarehouse;
    const listTo = document.getElementById('listTo').value;
    const stockRollInput = document.getElementById('stockRollInput').value;
    const stockKgInput = document.getElementById('stockKgInput').value;
    const stockRibInput = document.getElementById('stockRibInput').value;
    const tanggalReceivedInput = document.getElementById('tanggalReceivedInput').value;

    // Check if the "From" input is the same as the selected value in the "To" dropdown
    if (fromInput === listTo) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Warehouse Asal dan Tujuan Tidak Boleh Sama!',
        });
        return; // Stop further processing
    }

    // Check if any of the fields is empty
    if (!skuInput || !fromInput || !listTo || !stockRollInput || !stockKgInput || !stockRibInput || !tanggalReceivedInput) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Field harus diisi!',
        });
        return; // Stop further processing
    }

    // Create a data object to be sent
    const postData = {
        sku: skuInput,
        warehouse_id_from: fromInput,
        warehouse_id_to: listTo,
        stock_roll: stockRollInput,
        stock_kg: stockKgInput,
        stock_rib: stockRibInput,
        date_received: tanggalReceivedInput,
    };

    // Display SweetAlert for confirmation
    Swal.fire({
        title: 'Warehouse Transfer',
        text: 'Anda Yakin Melakukan Transfer?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            // Perform the POST request
            fetch(WarehouseTransfer, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Stock transferred successfully") {
                    // Display success SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses!',
                        text: 'Transfer Berhasil Ditambahkan!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // Refresh the page after successful addition
                        window.location.href = 'warehouse_transfer_view.html';
                    });
                } else {
                    // Display error SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Transfer Gagal Ditambahkan!',
                    });
                }
            })
            .catch(error => {
                console.error("Error while adding contact data:", error);
            });
        }
    });
});