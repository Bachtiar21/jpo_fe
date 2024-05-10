import { BaseUrl, UrlGetSalesOrderById, UrlGetByIdContact, UrlGetAllContact, UrlGetWarehouseByIdByToken, UrlPutSalesOrder, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetSalesOrderById = BaseUrl + UrlGetSalesOrderById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;
const GetAllContact = BaseUrl + UrlGetAllContact;
const PutSalesOrder = BaseUrl + UrlPutSalesOrder + `/${id}`;

let salesData;

// Fetch Data Kontak di Dropdown
const dropdownVendor = document.getElementById("listBroker");
// Fetch data dari API
fetch(GetAllContact, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((broker) => {
            const option = document.createElement("option");
            option.value = broker.id;
            option.textContent = broker.name;
            dropdownVendor.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching brokers:', error);
});

// Fetch data from API endpoint
fetch(GetSalesOrderById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    const contactId = data.data.contact_id;
    const  warehouseId = data.data.warehouse_id;
    salesData = data.data;
            
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
    document.getElementById('nomorSoInput').value = data.data.no_so;
    document.getElementById('skuInput').value = data.data.sku;
    document.getElementById('stockRollInput').value = data.data.stock_roll;
    document.getElementById('stockKgInput').value = data.data.stock_kg;
    document.getElementById('stockRibInput').value = data.data.stock_rib;
    document.getElementById('hargaJualInput').value = data.data.price;

    // Check if broker and broker_fee exist
    const brokerId = data.data.broker;
    const brokerFee = data.data.broker_fee;

    if (brokerId && brokerFee) {
        document.querySelector('input[value="true"][name="radios-example"]').checked = true;
        document.querySelector('.broker').style.display = 'block';
        document.getElementById('listBroker').value = brokerId;
        document.querySelector('input[value="manualFee"][name="inline-radios-example"]').checked = true;
        document.querySelector('.manualFeeInput').style.display = 'block';
        document.getElementById('manualFeeInput').value = brokerFee;
    }
})
.catch(error => console.error('Error:', error));

// Update Data Purchase Order
// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {

    const stockRollInput = document.getElementById('stockRollInput').value;
    const stockKgInput = document.getElementById('stockKgInput').value;
    const stockRibInput = document.getElementById('stockRibInput').value;
    const hargaJualInput = document.getElementById('hargaJualInput').value;
    const manualFeeInput = document.getElementById('manualFeeInput').value;

    const updatedData = {
        stock_roll: stockRollInput,
        stock_kg: stockKgInput,
        stock_rib: stockRibInput,
        price: hargaJualInput,
        broker_fee: manualFeeInput,
    };
    
    if (isDataChanged(salesData, updatedData)) {
        showConfirmationAlert(updatedData);
    } else {
        showNoChangeAlert();
    }
});

// Fungsi untuk membandingkan apakah ada perubahan pada data
function isDataChanged(existingData, newData) {
    return (
        existingData.stock_roll !== newData.stock_roll ||
        existingData.stock_kg !== newData.stock_kg ||
        existingData.stock_rib !== newData.stock_rib ||
        existingData.price !== newData.price ||
        existingData.broker_fee !== newData.broker_fee
    );
}

// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
    Swal.fire({
        title: 'Perubahan Data Sales Order',
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
                updateSalesOrder(updatedData);
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
                text: 'Perubahan Data Sales Order Dibatalkan!',
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
function updateSalesOrder(data) {
    fetch(PutSalesOrder, {
        method: "PUT",
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
            text: 'Data Sales Order Berhasil Diperbarui',
            showConfirmButton: false,
            timer: 1500
        })
        .then(() => {
            window.location.href = 'sales_so_list_view.html';
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
                text: 'Gagal memperbarui data Sales Order!',
            });
        }
    });
}