import { BaseUrl, UrlGetAllBank, UrlGetBillById, UrlGetBankById, UrlGetByIdContact, UrlPaidBill, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const BillById = BaseUrl + UrlGetBillById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const AllBank = BaseUrl + UrlGetAllBank;
const PaidBill = BaseUrl + UrlPaidBill + `/${id}/payment`;
const GetBankById = BaseUrl + UrlGetBankById;

let billData;

// Fetch Data Convection
fetch(BillById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    const contactId = data.data.contact_id;
	const bankId = data.data.bank_id;
	const sellPrice = data.data.bill_price;
    const payment = data.data.payment;
    const remainingPayment = sellPrice - payment;

    // Menentukan teks yang akan ditampilkan pada elemen h5
    const ketPayment = `Informasi : Sell Price yang harus dibayar (${sellPrice}), Payment yang sudah dibayar (${payment}), dan Sisa yang harus dibayar (${remainingPayment})`;
    billData = data.data;
            
    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
        .then(response => response.json())
        .then(contactData => {
            if (contactData && contactData.data) {
                const contactName = contactData.data.name;
                document.getElementById("vendorInput").value = contactName;
            }
    });

	// Fetch data Rekening
    fetch(GetBankById + `/${bankId}`, requestOptionsGet)
      .then((response) => response.json())
      .then((bankData) => {
        if (bankData && bankData.data) {
          const bankName = bankData.data.bank + "(" + bankData.data.no_rek + ")" + "-" + bankData.data.name_rek;
          document.getElementById("rekeningNow").value = bankName;
        }
    });

    if (data.data.bank_id !== null) {
        document.getElementById("listRekening").setAttribute("hidden", "hidden");
        document.getElementById("rekeningNow").removeAttribute("hidden");
    }

    // Mendapatkan tanggal dari created_at
    const createdDate = new Date(data.data.created_at);
    const today = new Date();
    const timeDifference = Math.abs(today - createdDate);
    const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // Menentukan nilai Aging berdasarkan status Paid atau tidak
    let aging;
    if (data.data.paid_status === 'paid') {
        aging = 0;
    } else {
        aging = differenceInDays;
    }

    // Populate form fields with data
    document.getElementById("dateInput").value = aging + " Hari";
    document.getElementById("jumlahInput").value = data.data.bill_price;
	document.getElementById("ketPayment").innerText = ketPayment;
})
.catch(error => console.error('Error:', error));

// Fetch Data Rekening di Dropdown
const dropdownRekening = document.getElementById("listRekening");
    fetch(AllBank, requestOptionsGet)
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((bank) => {
                const option = document.createElement("option");
                option.value = bank.id;
                option.textContent = bank.bank + ' - ' + bank.name_rek + ' - ' + bank.no_rek;
                dropdownRekening.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error fetching banks:', error);
});

// Paid Bill
// Event listener untuk tombol "Submit Paid"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
	const listRekening = document.getElementById('listRekening').value;
	const paymentInput = document.getElementById('paymentInput').value;

	const paidData = {
		paid_price: paymentInput,
		bank_id: listRekening
	};
    
	if (isDataChanged(billData, paidData)) {
		showConfirmationAlert(paidData);
	} else {
		showNoChangeAlert();
	}
});
// Fungsi untuk membandingkan apakah ada perubahan pada data
function isDataChanged(existingData, paidData) {
	return (
		existingData.paid_price !== paidData.paid_price ||
		existingData.bank_id !== paidData.bank_id
	);
}
// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
	Swal.fire({
		title: 'Paid Bill',
		text: "Apakah anda yakin ingin melakukan Paid pada Bill ini?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			paidBill(data);
			// Menampilkan Data Alert Success
			Swal.fire({
				icon: 'success',
				title: 'Sukses!',
				text: 'Berhasil melakukan Paid',
				showConfirmButton: false,
				timer: 1500
			})
			.then(() => {
				window.location.href = '../finance.html';
			});
		} else {
			// Menampilkan Data Alert Error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Paid gagal dilakukan!',
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
function paidBill(data) {
	fetch(PaidBill, {
		method: "PUT",
		headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
		body: JSON.stringify(data)
	})
		.catch(error => {
			console.error("Error saat melakukan paid data:", error);
		});
}