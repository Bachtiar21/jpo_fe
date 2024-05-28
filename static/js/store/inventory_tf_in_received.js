import { BaseUrl, UrlReceivedTransferIn } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const receivedTfIn = BaseUrl + UrlReceivedTransferIn + `/${id}/receive`;

// Default Tanggal Receive
document.getElementById('tanggalInput').value = new Date().toISOString().split('T')[0];

// Function to add bank data
function ReceivedTfIn(postData) {
    fetch(receivedTfIn, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Transfer in received successfully") {
        // Display success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Sukses!',
          text: 'Transfer In Berhasil Di received!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'inventory_tf_view.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Transfer In Gagal Di received!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding receive data:", error);
    });
  }
  
// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const stokRib = document.querySelector('#stokRib').value;
  const stokRoll = document.querySelector('#stokRoll').value;
  const stokKg = document.querySelector('#stokKg').value;
  const receiveDate = document.querySelector('#tanggalInput').value;
  
  // Check if any of the fields is empty
  if (!stokRib || !stokRoll || !stokKg || !receiveDate) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Semua field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    stock_roll : stokRoll,
    stock_kg: stokKg,
    stock_rib : stokRib,
    receive_date : receiveDate

  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Received Transfer In',
    text: 'Anda Yakin Received Transfer In?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call function to add employee data
      ReceivedTfIn(postData);
    }
  });
});