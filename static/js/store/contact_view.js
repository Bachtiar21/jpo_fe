import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetAllContact, UrlDeleteContact, requestOptionsDelete, requestOptionsGet } from "../controller/template.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 5;
	let halamannow = 1;

    const AllContact = BaseUrl + UrlGetAllContact;
	const DeleteContactById = BaseUrl + UrlDeleteContact;

fetch(AllContact, requestOptionsGet)
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
                            <p class="fw-normal mb-1">${values.name}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.phone_number}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1"></p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1"></p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1"></p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <button type="button" class="btn btn-info" data-contact-id="${values.id}">Detail</button>
                            <button type="button" class="btn btn-warning" data-contact-id="${values.id}">Edit</button>	
                            <button type="button" class="btn btn-danger" data-contact-id="${values.id}">Delete</button>
                        </td>
                    </tr>`;
		});
		document.getElementById("tablebody").innerHTML = tableData;

		displayData(halamannow);
		updatePagination();

        // Menambahkan event listener untuk button "Detail Data"
        const detailContactButton = document.querySelectorAll('.btn-info');
        detailContactButton.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-contact-id');
                window.location.href = `contact_detail.html?id=${id}`;
            })
        })

		// Menambahkan event listener untuk button "Update Data"
		const updateContactButton = document.querySelectorAll('.btn-warning');
		updateContactButton.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-contact-id');
				window.location.href = `contact_edit.html?id=${id}`;
			});
		});
		
	})
	.catch(error => {
		console.log('error', error);
	});

// Function Delete Data Kontak
// Add event listener for "Hapus" button
document.getElementById("tablebody").addEventListener("click", (event) => {
	const target = event.target;
	if (target.classList.contains("btn-danger")) {
	  const id = target.getAttribute("data-contact-id");
	  if (id) {
		// Display SweetAlert confirmation dialog
		Swal.fire({
		  title: 'Hapus Data Kontak?',
		  text: "Data tidak akan dapat mengembalikan ini!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes'
		}).then((result) => {
		  if (result.isConfirmed) {
			// Kontak confirmed, call the function to handle deletion
			deleteContact(id);
		  }
		});
	  }
	}
  });
  
  // Function to delete data
  function deleteContact(id) {
	fetch(DeleteContactById + `/${id}`, requestOptionsDelete)
	  .then((response) => response.json())
	  .then((data) => {
		// Handle successful deletion
		console.log("Data deleted:", data);
		// You might want to update the table or handle other UI updates here
		
		// Display success SweetAlert
		Swal.fire({
			title: 'Deleted!',
			text: 'Data Kontak Berhasil Dihapus.',
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
			'Data Kontak Gagal Dihapus',
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