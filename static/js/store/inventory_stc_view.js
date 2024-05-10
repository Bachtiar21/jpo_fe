import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetByIdContact, UrlGetAllStock, UrlGetAllStockNew, requestOptionsGet } from "../controller/template.js";
import { getBadgePO } from "../style/badge.js";

document.addEventListener('DOMContentLoaded', function() {
    const selectKategori = document.getElementById('selectKategori');
    const stockMenuAll = document.getElementById('stockMenuAll');
    const stockMenuWarehouse = document.getElementById('stockMenuWarehouse');

    selectKategori.addEventListener('change', function() {
        if (selectKategori.value === 'all') {
            stockMenuAll.removeAttribute('hidden');
            stockMenuWarehouse.setAttribute('hidden', true);;
        } else if (selectKategori.value === 'warehouse') {
            stockMenuWarehouse.removeAttribute('hidden');
            stockMenuAll.setAttribute('hidden', true);
        } else {
            stockMenuAll.setAttribute('hidden', true);
            stockMenuWarehouse.setAttribute('hidden', true);
        }
    });
});

// Fetch Data All
// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebodyAll");
	const buttonsebelumnya = CihuyId("prevPageBtnAll");
	const buttonselanjutnya = CihuyId("nextPageBtnAll");
	const halamansaatini = CihuyId("currentPageAll");
	const itemperpage = 5;
	let halamannow = 1;

    const AllStock = BaseUrl + UrlGetAllStock;
    const AllStockNew = BaseUrl + UrlGetAllStockNew;

    fetch(AllStockNew)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            let tableData = "";
            data.data.map((values) => {
                tableData += `
                            <tr>
                            <td hidden></td>
                            <td style="text-align: center; vertical-align: middle">
                                <p class="fw-normal mb-1">${values.nama_barang}</p>
                            </td>
                            <td style="text-align: center; vertical-align: middle">
                                <p class="fw-normal mb-1">${values.sku}</p>
                            </td>
                            <td style="text-align: center; vertical-align: middle">
                                <p class="fw-normal mb-1">${values.grade}</p>
                            </td>
                            <td style="text-align: center; vertical-align: middle">
                                <p class="fw-normal mb-1">${values.stock_roll_rev} Roll, ${values.stock_kg_rev} Kg</p>
                            </td>
                            <td style="text-align: center; vertical-align: middle">
                                <button type="button" class="btn btn-info" data-po-id="${values.id}">Detail</button>	
                            </td>
                        </tr>`;
            });
            document.getElementById("tablebodyAll").innerHTML = tableData;

            displayData(halamannow);
            updatePagination();

            // Menambahkan event listener untuk button "Detail Data"
            const detailPOButtons = document.querySelectorAll('.btn-info');
            detailPOButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-po-id');
                    window.location.href = `inventory_stc_all_detail.html?id=${id}`;
                });
            });
            
        })
        .catch(error => {
            console.log('error', error);
	});

function displayData(page) {
	const baris = CihuyQuerySelector("#tablebodyAll tr");
	const mulaiindex = (page - 1) * itemperpage;
	const akhirindex = mulaiindex + itemperpage;

	for (let i = 0; i < baris.length; i++) {
		if (i >= mulaiindex && i < akhirindex) {
			baris[i].style.display = "table-row";
		} else {
			baris[i].style.display = "none";
		}
	}
}
function updatePagination() {
	halamansaatini.textContent = `Halaman ${halamannow}`;
}

buttonsebelumnya.addEventListener("click", () => {
	if (halamannow > 1) {
		halamannow--;
		displayData(halamannow);
		updatePagination();
	}
});

buttonselanjutnya.addEventListener("click", () => {
	const totalPages = Math.ceil(
		tablebody.querySelectorAll("#tablebodyAll tr").length / itemperpage
	);
	if (halamannow < totalPages) {
		halamannow++;
		displayData(halamannow);
		updatePagination();
	}
  });
});