import {
  BaseUrl,
  UrlCekUser,
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
      } else if (userRole === "store") {
        document.getElementById("storeRoles").removeAttribute("hidden");
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
    "http://127.0.0.1:5500/jpo_erp/static/theme/sidebar.html"
  );
});
