import { BaseUrl, UrlGetStockAllById, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetStockAllById = BaseUrl + UrlGetStockAllById + `/${id}`;

// Fetch data from API endpoint
fetch(GetStockAllById, requestOptionsGet)
.then(response => response.json())
.then(responseData => {
    const data = responseData.data;
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