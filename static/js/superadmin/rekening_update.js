import { BaseUrl, UrlGetBankById, UrlPutBank, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const ConvectionById = BaseUrl + UrlGetBankById + `/${id}`;
const PutBankById = BaseUrl + UrlPutBank + `/${id}`;

let rekeningData;

// Fetch Data Convection
fetch(ConvectionById, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((values) => {
		if (values && values.data) { // Memastikan values dan values.data tidak undefined
			rekeningData = values.data;

			document.getElementById("namaRekeningInput").value = values.data.name_rek;
			document.getElementById("noRekeningInput").value = values.data.no_rek;
			document.getElementById("bankInput").value = values.data.bank;
            document.getElementById("selectStatus").value = values.data.status
			rekeningData = values.data; // Menyimpan data pabrik untuk digunakan nanti
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
	const namaRekeningInput = document.getElementById('namaRekeningInput').value;
	const noRekeningInput = document.getElementById('noRekeningInput').value;
	const bankInput = document.getElementById('bankInput').value;
	const updatedData = {
		name_rek: namaRekeningInput,
		no_rek: noRekeningInput,
		bank: bankInput
	};
    
	if (isDataChanged(rekeningData, updatedData)) {
		showConfirmationAlert(updatedData);
	} else {
		showNoChangeAlert();
	}
});
// Fungsi untuk membandingkan apakah ada perubahan pada data
function isDataChanged(existingData, newData) {
	return (
		existingData.name_rek !== newData.name_rek ||
		existingData.no_rek !== newData.no_rek ||
		existingData.bank !== newData.bank
	);
}
// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
	Swal.fire({
		title: 'Perubahan Data Rekening',
		text: "Apakah anda yakin ingin melakukan perubahan?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			updateRekening(data);
			// Menampilkan Data Alert Success
			Swal.fire({
				icon: 'success',
				title: 'Sukses!',
				text: 'Data Rekening Berhasil Diperbarui',
				showConfirmButton: false,
				timer: 1500
			})
			.then(() => {
				window.location.href = 'rekening_view.html';
			});
		} else {
			// Menampilkan Data Alert Error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Data Rekening Gagal Diperbarui!',
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
function updateRekening(data) {
	fetch(PutBankById, {
		method: "PUT",
		headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
		body: JSON.stringify(data)
	})
		.catch(error => {
			console.error("Error saat melakukan PUT data:", error);
	});
}