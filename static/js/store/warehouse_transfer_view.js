import { BaseUrl, UrlGetSKUForWarehouseTf, UrlGetStockBySKU, requestOptionsGet } from "../controller/template.js";
import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";

document.addEventListener('DOMContentLoaded', () => {
    const GetSKUForWarehouseTf = BaseUrl + UrlGetSKUForWarehouseTf;

    // Fetch Data Kontak di Dropdown
    const dropdownSKU = document.getElementById("listSKU");

    // Fetch data dari API
    fetch(GetSKUForWarehouseTf, requestOptionsGet)
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((SKU) => {
                const option = document.createElement("option");
                option.value = SKU.id;
                option.textContent = SKU.sku;
                dropdownSKU.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error fetching contacts:', error);
        });
    
        dropdownSKU.addEventListener('change', () => {
            // const SKUPilih = event.target.textContent;
            const selectedSKUNama = dropdownSKU.options[dropdownSKU.selectedIndex].textContent;
            fetchDataBySKU(selectedSKUNama);
        });
        
    });
    
    // Fetch Data All
    // Untuk Membuat Pagination
    function fetchDataBySKU(selectedSKUNama) {
        CihuyDomReady(() => {
            const tablebody = CihuyId("tablebody");
            const buttonsebelumnya = CihuyId("prevPageBtn");
            const buttonselanjutnya = CihuyId("nextPageBtn");
            const halamansaatini = CihuyId("currentPage");
            const itemperpage = 5;
            let halamannow = 1;
            
                const GetStockBySKU = BaseUrl + UrlGetStockBySKU + `/${selectedSKUNama}/sku`;

                fetch(GetStockBySKU, requestOptionsGet)
                    .then((result) => result.json())
                    .then((data) => {
                        let tableData = "";
                        data.data.map((values) => {
                            tableData += `
                                <tr>
                                    <td hidden></td>
                                    <td style="text-align: center; vertical-align: middle">
                                        <p class="fw-normal mb-1">${values.warehouse.name}</p>
                                    </td>
                                    <td style="text-align: center; vertical-align: middle">
                                        <button type="button" class="btn btn-info" data-po-id="${values.warehouse_id}">Transfer</button>	
                                    </td>
                                </tr>`;
                        });
                        document.getElementById("tablebody").innerHTML = tableData;

                        displayData(halamannow);
                        updatePagination();

                        // Menambahkan event listener untuk button "Detail Data"
                        const detailPOButtons = document.querySelectorAll('.btn-info');
                        detailPOButtons.forEach(button => {
                            button.addEventListener('click', (event) => {
                                const id = event.target.getAttribute('data-po-id');
                                window.location.href = `warehouse_transfer.html?id_warehouse=${id}?sku=${selectedSKUNama}`;
                            });
                        });

                    })
                    .catch(error => {
                        console.log('error', error);
                    });

            function displayData(page) {
                const baris = CihuyQuerySelector("#tablebody tr");
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
                    tablebody.querySelectorAll("#tablebody tr").length / itemperpage
                );
                if (halamannow < totalPages) {
                    halamannow++;
                    displayData(halamannow);
                    updatePagination();
                }
            });
        })
    };