import { BaseUrl, UrlGetByIdContact, UrlPutContact, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const ContactById = BaseUrl + UrlGetByIdContact + `/${id}`;
const PutContact = BaseUrl + UrlPutContact + `/${id}`;

let contactData;

// Fetch Data Convection
fetch(ContactById, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((values) => {
		if (values && values.data) {
            contactData = values.data;

			document.getElementById("namaInput").value = values.data.name;
			document.getElementById("noHpInput").value = values.data.phone_number;
			document.getElementById("alamatInput").value = values.data.address;

		} else {
			console.log("Data tidak ditemukan");
		}
	})
	.catch(error => {
		console.log('error', error);
});

// Update Data Toko
// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
	const namaInput = document.getElementById('namaInput').value;
	const noHpInput = document.getElementById('noHpInput').value;
	const alamatInput = document.getElementById('alamatInput').value;

	const updatedData = {
		name: namaInput,
		address: alamatInput,
		phone_number: noHpInput
	};
    
	if (isDataChanged(contactData, updatedData)) {
		showConfirmationAlert(updatedData);
	} else {
		showNoChangeAlert();
	}
});
// Fungsi untuk membandingkan apakah ada perubahan pada data
function isDataChanged(existingData, newData) {
	return (
		existingData.name !== newData.name ||
		existingData.address !== newData.address ||
		existingData.phone_number !== newData.phone_number
	);
}
// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
	Swal.fire({
		title: 'Perubahan Data Kontak',
		text: "Apakah anda yakin ingin melakukan perubahan?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			updateContact(data);
		} else {
			// Menampilkan Data Alert Error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Data Kontak Gagal Diperbarui!',
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
function updateContact(data) {
    fetch(PutContact, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Gagal memperbarui data Kontak');
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
            text: 'Data Kontak Berhasil Diperbarui',
            showConfirmButton: false,
            timer: 1500
        });
        // Redirect to another page if needed
        window.location.href = 'contact_view.html';
    })
    .catch(error => {
        console.error("Error saat melakukan PUT data:", error);
        // Handle specific error message
        if (error.message === 'Gagal memperbarui data Kontak') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal memperbarui data Kontak!',
            });
        } else {
            // Handle other errors
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal memperbarui data Kontak!',
            });
        }
    });
}