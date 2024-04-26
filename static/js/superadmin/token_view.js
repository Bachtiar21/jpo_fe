import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlDeleteToken, UrlGetAllToken, UrlGetUserById, requestOptionsGet, requestOptionsDelete } from "../controller/template.js";
import { getBadgeBank } from "../style/badge.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 5;
	let halamannow = 1;

    const AllToken = BaseUrl + UrlGetAllToken;
    const UserById = BaseUrl + UrlGetUserById;
    const DeleteTokenById = BaseUrl + UrlDeleteToken;

// Setelah mendapatkan data token, Anda dapat memanggil fungsi getUserName untuk mengganti user_id dengan nama pengguna
fetch(AllToken, requestOptionsGet)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            let tableData = "";
            data.data.map(async (values) => {
                let userNameData = '';
                tableData += `
                    <tr>
                        <td hidden></td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.token_update}</p>
                        </td>
                        <td id="userNameCell${values.user_id}" style="text-align: center; vertical-align: middle">
                            ${values.user_id ? `<span id="userNameSpan${values.user_id}"></span>` : 'Tidak Ada'}
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${getBadgeBank(values.status)}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-info" data-token-id="${values.id}">Detail</button> 
							<button type="button" class="btn btn-warning" data-token-id="${values.id}">Update</button>   
                            <button type="button" class="btn btn-danger" data-token-id="${values.id}">Delete</button>
                        </td>
                    </tr>`;
                if (values.user_id) {
                    fetch(UserById + `/${values.user_id}`, requestOptionsGet)
                        .then(response => response.json())
                        .then(userData => {
                            userNameData = userData.user.name;
                            document.getElementById(`userNameSpan${values.user_id}`).textContent = userNameData;
                        })
                        .catch(error => console.error('Error fetching store data:', error));
                }
            });
            document.getElementById("tablebody").innerHTML = tableData;

            displayData(halamannow);
            updatePagination();

			// Listener Button Detail
            const detailTokenButtons = document.querySelectorAll('.btn-info');
            detailTokenButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-token-id');
                    window.location.href = `token_detail.html?id=${id}`;
                });
            });

			// Listener Button Update
			const updateTokenButtons = document.querySelectorAll('.btn-warning');
			updateTokenButtons.forEach(button => {
				button.addEventListener('click', (event) => {
					const id = event.target.getAttribute('data-token-id');
					window.location.href = `token_update.html?id=${id}`;
				});
			});

        })
        .catch(error => {
            console.log('error', error);
});

// Function Delete Data Token
// Add event listener for "Hapus" button
document.getElementById("tablebody").addEventListener("click", (event) => {
	const target = event.target;
	if (target.classList.contains("btn-danger")) {
	  const id = target.getAttribute("data-token-id");
	  if (id) {
		// Display SweetAlert confirmation dialog
		Swal.fire({
		  title: 'Hapus Data Token?',
		  text: "Data tidak akan dapat mengembalikan ini!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes'
		}).then((result) => {
		  if (result.isConfirmed) {
			// Token confirmed, call the function to handle deletion
			deleteToken(id);
		  }
		});
	  }
	}
  });
  
  // Function to delete data
  function deleteToken(id) {
	fetch(DeleteTokenById + `/${id}`, requestOptionsDelete)
	  .then((response) => response.json())
	  .then((data) => {
		// Handle successful deletion
		console.log("Data deleted:", data);
		// You might want to update the table or handle other UI updates here
		
		// Display success SweetAlert
		Swal.fire({
			title: 'Deleted!',
			text: 'Data Token Berhasil Dihapus.',
			icon: 'success',
			timer: 1500,
			showConfirmButton: false
		  }).then(() => {
			// Reload the page after successful deletion
			location.reload();
		  });
		})
	  	.catch((error) => {
			console.error("Error deleting data:", error);
			
			// Display error SweetAlert
			Swal.fire(
			'Error!',
			'Data Token Gagal Dihapus',
			'error'
			);
	});
}

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
});