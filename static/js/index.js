import { BaseUrl, UrlCekUser, requestOptionsPost, requestOptionsGet } from "./controller/template.js";
import { setInnerText } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.5/croot.js";

// Fungsi untuk menampilkan navbarIndex dan menyembunyikan navbarHome
function tampilkanNavbarIndex() {
    document.getElementById('navbarHome').style.display = 'none';
    document.getElementById('navbarIndex').removeAttribute('hidden');
}

// Fungsi untuk menampilkan navbarHome dan menyembunyikan navbarIndex
function tampilkanNavbarHome() {
    document.getElementById('navbarHome').style.display = 'block';
    document.getElementById('navbarIndex').setAttribute('hidden', 'true');
}

// Create Url Cek User
const CekUser = BaseUrl + UrlCekUser;
  
// Melakukan permintaan POST ke endpoint
fetch(CekUser, requestOptionsPost)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Gagal memuat data pengguna');
        }
    })
    .then(data => {
        setInnerText('namaUser', data.name);
        tampilkanNavbarIndex();
    })
    .catch(error => {
        console.error('Terjadi kesalahan:', error);
        tampilkanNavbarHome();
});

// URL endpoint data stok
const stockEndpoint = 'http://127.0.0.1:8000/api/auth/inventory/stocks';

// Fungsi untuk mengambil data stok dari API
async function fetchStockData() {
    try {
        const response = await fetch(stockEndpoint, requestOptionsGet);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return [];
    }
}

// Fungsi untuk membuat elemen card HTML untuk setiap entri stok
function createStockCard(stock) {
    const card = document.createElement('div');
    card.className = 'col-3';
    card.innerHTML = `
        <div class="card">
            <img class="card-img-top" src="./src/img/photos/unsplash-1.jpg" alt="Unsplash">
            <div class="card-header">
                <h5 class="card-title mb-0">${stock.nama_barang} | ${stock.grade}</h5>
                <p class="card-text">#${stock.sku}</p>
            </div>
            <div class="card-body">
                <p class="card-text">${stock.description}</p>
                <p class="card-text">Stock Tersisi : ${stock.stock_roll_rev} Roll ${stock.stock_kg_rev} Kg</p>
            </div>
        </div>
    `;
    return card;
}

let currentPage = 1;
const itemsPerPage = 8;

// Fungsi untuk menampilkan data stok di HTML
async function displayStockData() {
    const stockContainer = document.querySelector('.container-fluid .row:nth-child(2)');
    stockContainer.innerHTML = '';

    const stocks = await fetchStockData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStocks = stocks.slice(startIndex, endIndex);

    currentStocks.forEach(stock => {
        const card = createStockCard(stock);
        stockContainer.appendChild(card);
    });
}

document.getElementById('nextPageBtn').addEventListener('click', () => {
    currentPage++;
    displayStockData();
    updatePagination();
});

document.getElementById('prevPageBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayStockData();
        updatePagination();
    }
});

function updatePagination() {
    const currentPageElement = document.getElementById('currentPage');
    currentPageElement.textContent = `Halaman ${currentPage}`;
}

displayStockData();