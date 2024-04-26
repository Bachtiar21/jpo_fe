import { BaseUrl, UrlGetByIdPurchaseOrder, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetByIdPurchaseOrder = BaseUrl + UrlGetByIdPurchaseOrder + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;

// Fetch Data User
fetch(GetByIdPurchaseOrder, requestOptionsGet)
    .then((result) => {
        return result.json();
    })
    .then((values) => {
        if (values && values.data) {
            // Ambil data PO
            const purchaseOrderData = values.data;
            const contactId = purchaseOrderData.contact_id;
            const warehouseId = purchaseOrderData.warehouse_id;
            
            // Fetch data kontak
            fetch(GetContactById + `/${contactId}`, requestOptionsGet)
                .then(response => response.json())
                .then(contactData => {
                    if (contactData && contactData.data) {
                        const contactName = contactData.data.name;
                        document.getElementById("contactInput").value = contactName;
                    }
            });

            // Fetch data kontak
            fetch(GetWarehouseByIdByToken + `/${warehouseId}`, requestOptionsGet)
                .then(response => response.json())
                .then(warehouseData => {
                    if (warehouseData && warehouseData.data) {
                        const warehouseName = warehouseData.data.name;
                        document.getElementById("warehouseInput").value = warehouseName;
                    }
            });

            // Set nilai-nilai PO ke dalam elemen HTML yang sesuai
            document.getElementById("nomorDoInput").value = purchaseOrderData.no_po;
            document.getElementById("namaBarangInput").value = purchaseOrderData.nama_barang;
            document.getElementById('ketebalanInput').value = purchaseOrderData.ketebalan;
            document.getElementById('settingInput').value = purchaseOrderData.setting;
            document.getElementById('gramasiInput').value = purchaseOrderData.gramasi;
            document.getElementById("gradeInput").value = purchaseOrderData.grade;
            document.getElementById("skuInput").value = purchaseOrderData.sku;
            document.getElementById("tanggalInput").value = purchaseOrderData.date;
            document.getElementById('deskripsiInput').value = purchaseOrderData.description;
            document.getElementById('stockRollInput').value = purchaseOrderData.stock_roll_rev;
            document.getElementById('stockKgInput').value = purchaseOrderData.stock_kg_rev;
            document.getElementById('stockRibInput').value = purchaseOrderData.stock_roll_rev;
            document.getElementById('hargaInput').value = purchaseOrderData.price;
            const imageElement = document.getElementById("fotoInput");
            imageElement.src = purchaseOrderData.attachment_image;
            document.getElementById("listStatus").value = purchaseOrderData.status;
        } else {
            console.log("Data tidak ditemukan");
        }
    })
    .catch(error => {
        console.log('error', error);
});

// Menambahkan event listener untuk button "Edit PO"
const editPOButtons = document.querySelectorAll('.btn-primary');
editPOButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = `purchase_po_edit.html?id=${id}`;
    });
});