import {
  BaseUrl,
  UrlCekUser,
  BaseUrlFe,
  requestOptionsPost,
} from "../../js/controller/template.js";

const CekUser = BaseUrl + UrlCekUser;

// Untuk render sidebar
document.addEventListener("DOMContentLoaded", function () {
  fetch(CekUser, requestOptionsPost)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      const userRole = data.roles;

      // Menampilkan atau menyembunyikan sidebar berdasarkan peran pengguna
      if (userRole === "superadmin") {
        document.getElementById("superadminRoles").removeAttribute("hidden");
        // Set Href Sidebar
        document.getElementById("adminUser").setAttribute("href", `${BaseUrlFe}superadmin/user/user_view.html`);
        document.getElementById("adminToko").setAttribute("href", `${BaseUrlFe}superadmin/toko/toko_view.html`);
        document.getElementById("adminGudang").setAttribute("href", `${BaseUrlFe}superadmin/gudang/gudang_view.html`);
        document.getElementById("adminPabrik").setAttribute("href", `${BaseUrlFe}superadmin/pabrik/pabrik_view.html`);
        document.getElementById("adminToken").setAttribute("href", `${BaseUrlFe}superadmin/token/token_view.html`);
        document.getElementById("adminRekening").setAttribute("href", `${BaseUrlFe}superadmin/rekening/rekening_view.html`);
      } else if (userRole === "store") {
        document.getElementById("storeRoles").removeAttribute("hidden");
        // Set Href Sidebar
        document.getElementById("storeInventory").setAttribute("href", `${BaseUrlFe}store/inventory.html`);
        document.getElementById("storePurchase").setAttribute("href", `${BaseUrlFe}store/purchase.html`);
        document.getElementById("storeSales").setAttribute("href", `${BaseUrlFe}store/sales.html`);
        document.getElementById("storeFinance").setAttribute("href", `${BaseUrlFe}store/finance.html`);
        document.getElementById("storeContact").setAttribute("href", `${BaseUrlFe}store/contact/contact_view.html`);
      } else if (userRole === "convection") {
        document.getElementById("convectionRoles").removeAttribute("hidden");
      } else {
        console.error("Unknown user role:", userRole);
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });

  $("#sidebar-container").load(
    `${BaseUrlFe}static/theme/sidebar.html`
  );
});
