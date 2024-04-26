import { BaseUrl, BaseUrlFe, BaseUrlFeDeploy, UrlCekUser, requestOptionsPost } from "./controller/template.js";
import { setInnerText } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.5/croot.js";

// Create Url Cek User
const CekUser = BaseUrl + UrlCekUser;
  
// Melakukan permintaan POST ke endpoint
fetch(CekUser, requestOptionsPost)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      setInnerText('namaUser', data.name);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      Swal.fire({
        title : 'Error!',
        text : 'Session login sudah habis, silahkan login kembali.',
        icon : 'error',
        timer : 2000,
        showConfirmButton : false
      }).then(() => {
        window.location.href = BaseUrlFe + 'index.html';
      })
});