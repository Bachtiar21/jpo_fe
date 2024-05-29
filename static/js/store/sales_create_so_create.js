import { BaseUrl, UrlGetWarehouseBySKU, UrlGetSKUByStock, UrlGetAllContact, UrlGetWarehouseByToken, UrlPostSalesOrder, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const GetAllSKU = BaseUrl + UrlGetSKUByStock;
const GetAllContact = BaseUrl + UrlGetAllContact;
const AllWarehouseByToken = BaseUrl + UrlGetWarehouseBySKU;
const GetAllBroker = BaseUrl + UrlGetAllContact;
const PostSalesOrder = BaseUrl + UrlPostSalesOrder;

const dropdownSKU = document.getElementById("listSKU");
fetch(GetAllSKU, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.sku;
            option.textContent = item.sku;
            dropdownSKU.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching SKU:', error);
});

const dropdownContact = document.getElementById("listContact");
fetch(GetAllContact, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((contact) => {
            const option = document.createElement("option");
            option.value = contact.id;
            option.textContent = contact.name;
            dropdownContact.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching SKU:', error);
});

const dropdownBroker = document.getElementById('listBroker')
fetch(GetAllBroker, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((contact) => {
            const option = document.createElement("option");
            option.value = contact.id;
            option.textContent = contact.name;
            dropdownBroker.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching Contact:', error);
});

const dropdownWarehouse = document.getElementById("listWarehouse");
// Event listener for SKU selection
dropdownSKU.addEventListener('change', () => {
    const selectedSKU = dropdownSKU.value;

    // Fetch warehouses based on selected SKU
    fetch(AllWarehouseByToken + `/${selectedSKU}/sku`, requestOptionsGet)
        .then((response) => response.json())
        .then((data) => {
            // Clear previous options
            dropdownWarehouse.innerHTML = "";

            // Populate dropdown with new options
            data.data.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.warehouse.id;
                option.textContent = item.warehouse.name;
                dropdownWarehouse.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error fetching warehouse:', error);
        });
});
const radioButtons = document.querySelectorAll('input[name="radios-example"]');
const brokerDiv = document.querySelector('.broker');
const manualFee = document.querySelector('.manualFeeInput');
const percenFee = document.querySelector('.percenFeeInput');
const feeRadioButtons = document.querySelectorAll('input[name="inline-radios-example"]');

feeRadioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
        if (this.value === "manualFee") {
            manualFee.style.display = 'block';
            percenFee.style.display = 'none';
        } else if (this.value === "percenFee") {
            manualFee.style.display = 'none';
            percenFee.style.display = 'block';
        }
    });
});

radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
        if (this.value === "true") {
            brokerDiv.style.display = 'block';
        } else {
            brokerDiv.style.display = 'none';
            // Set broker and broker fee to null
            document.querySelector('#listBroker').value = ""; 
            document.querySelector('#manualFeeInput').value = "";
            document.querySelector('#percenFeeInput').value = "";
        }
    });
});

const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
    const listContact = document.querySelector('#listContact').value;
    const listWarehouse = document.querySelector('#listWarehouse').value;
    const listSKU = document.querySelector('#listSKU').value;
    const dateInput = document.querySelector('#dateInput').value;
    const stokRoll = document.querySelector('#stokRoll').value;
    const stokKg = document.querySelector('#stokKg').value;
    const stokRib = document.querySelector('#stokRib').value;
    const hargaJualInput = document.querySelector('#hargaJualInput').value;
    let listBroker = document.querySelector('#listBroker').value;

    if (!listContact || !listWarehouse || !listSKU || !dateInput || !stokRoll || !stokKg || !stokRib || !hargaJualInput) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Field harus diisi!',
        });
        return;
    }

    if (listBroker === "Pilih Broker") {
        listBroker = "";
    }

    let brokerFeeValue;
    const manualFeeInput = document.querySelector('#manualFeeInput');
    const percenFeeInput = document.querySelector('#percenFeeInput');
    const isFeeSelected = document.querySelector('input[name="inline-radios-example"]:checked');

    if (isFeeSelected) {
        if (isFeeSelected.value === "manualFee") {
            brokerFeeValue = manualFeeInput.value;
        } else if (isFeeSelected.value === "percenFee") {
            const percentageFee = parseFloat(percenFeeInput.value) / 100; 
            brokerFeeValue = hargaJualInput * percentageFee;
        } else {
            brokerFeeValue = "";
        }
    } else {
        brokerFeeValue = "";
    }

    const isBrokerSelected = document.querySelector('input[name="radios-example"]:checked').value === "true";

    const postData = {
        sku: listSKU,
        broker_fee: isBrokerSelected ? brokerFeeValue : null,
        broker: isBrokerSelected ? listBroker : null,
        contact_id: listContact,
        warehouse_id: listWarehouse,
        date: dateInput,
        stock_roll: stokRoll,
        stock_kg: stokKg,
        stock_rib: stokRib,
        price: hargaJualInput,
    };

    Swal.fire({
        title: 'Tambah Sales Order',
        text: 'Anda Yakin Menambah Sales Order?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(PostSalesOrder, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.data) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses!',
                            text: 'Sales Order Berhasil Ditambahkan!',
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = "sales_so_list_view.html"
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.message,
                        });
                    }
                })
                .catch(error => {
                    console.error("Error while adding SO data:", error);
            });
        }
    });
});