import { BaseUrl, UrlGetTokenById, UrlGetUserById, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const TokenById = BaseUrl + UrlGetTokenById + `/${id}`;
const UserById = BaseUrl + UrlGetUserById;

// Fetch Data Token
fetch(TokenById, requestOptionsGet)
    .then((result) => {
        return result.json();
    })
    .then((values) => {
        if (values && values.data) {
            document.getElementById("tokenInput").value = values.data.token_update;

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

            // Keterangan Status Token
            if (values.data.status === "not") {
                document.getElementById("statusTokenInput").value = "Tidak Dipakai";
            } else if (values.data.status === "used") {
                document.getElementById("statusTokenInput").value = "Dipakai";
            } else {
                document.getElementById("statusTokenInput").value = "";
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