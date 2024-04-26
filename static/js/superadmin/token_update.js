import { BaseUrl, UrlGetTokenById, UrlGetUserById, UrlPutToken, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const TokenById = BaseUrl + UrlGetTokenById + `/${id}`;
const UserById = BaseUrl + UrlGetUserById;
const PutTokenById = BaseUrl + UrlPutToken + `/${id}`;

// Fetch Data Token
fetch(TokenById, requestOptionsGet)
    .then((result) => {
        return result.json();
    })
    .then((values) => {
        if (values && values.data) {
            document.getElementById("tokenInput").value = values.data.token_update;
            document.getElementById("statusTokenInput").value  = values.data.status;

            // Keterangan Nama Pengguna
            if (values.data.user_id === null) {
                document.getElementById("namaPenggunaInput").value = "Tidak Ada";
            } else {
                fetch(UserById + `/${values.data.user_id}`, requestOptionsGet)
                    .then((result) => {
                        return result.json();
                    })
                    .then((values) => {
                        if (values && values.user) {
                            document.getElementById("namaPenggunaInput").value = values.user.name;
                        } else {
                            console.log("User Tidak Ditemukan.")
                        }
                    })
                    .catch(error => {
                        console.log('error', error)
                    });
            }

            // Format tanggal dari string ISO ke format yang diinginkan (dd/mm/yy (jam:menit:detik))
            const createdDate = new Date(values.data.created_at);
            const updatedDate = new Date(values.data.updated_at);

            const formatDate = (date) => {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();
                
                return `${day}/${month}/${year} (${hours}:${minutes}:${seconds})`;
            };

            document.getElementById("dateCreatedInput").value = formatDate(createdDate);
            document.getElementById("dateUpdatedInput").value = formatDate(updatedDate);
        } else {
            console.log("Data tidak ditemukan");
        }
    })
    .catch(error => {
        console.log('error', error);
});

// Update Data Token
// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
	const tokenInput = document.getElementById('tokenInput').value;
	const statusTokenInput = document.getElementById('statusTokenInput').value;
	const namaPenggunaInput = document.getElementById('namaPenggunaInput').value;
	const updatedData = {
		token_update: tokenInput,
		user_id: statusTokenInput,
		status: namaPenggunaInput
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
		existingData.token_update !== newData.token_update ||
		existingData.user_id !== newData.user_id ||
		existingData.status !== newData.status
	);
}
// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
	Swal.fire({
		title: 'Perubahan Data Token',
		text: "Apakah anda yakin ingin melakukan perubahan?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			updateToken(data);
			// Menampilkan Data Alert Success
			Swal.fire({
				icon: 'success',
				title: 'Sukses!',
				text: 'Data Token Berhasil Diperbarui',
				showConfirmButton: false,
				timer: 1500
			})
			.then(() => {
				window.location.href = 'token_view.html';
			});
		} else {
			// Menampilkan Data Alert Error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Data Token Gagal Diperbarui!',
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
function updateToken(data) {
	fetch(PutTokenById, {
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