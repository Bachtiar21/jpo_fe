// Import Libray yg dibutuhkan
import { token } from "./cookies.js";

// Base Url
// export let BaseUrl = "https://api-jpo.akhairi.com/";
export let BaseUrl = "http://127.0.0.1:8000/";
// export let BaseUrlFe = "https://bachtiar21.github.io/jpo_erp/";
export let BaseUrlFe = "http://127.0.0.1:5500/";
export let BaseUrlFeDeploy = "https://bachtiar21.github.io/jpo_erp/";
export let tokenGithub = "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";

// Membuat objek konfigurasi untuk permintaan POST
export let requestOptionsPost = {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};

// Membuat objek konfigurasi untuk permintaan GET
export let requestOptionsGet = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};

// Membuat objek konfigurasi untuk permintaan DELETE
export let requestOptionsDelete = {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};

// Endpoint Get All
export let UrlGetAllUser = "api/auth/users";
export let UrlGetAllStore = "api/auth/stores";
export let UrlGetAllConvection = "api/auth/convections";
export let UrlGetAllWarehouse = "api/auth/warehouses";
export let UrlCekUser = "api/auth/me";
export let UrlGetAllBank = "api/auth/banks";
export let UrlGetAllToken = "api/auth/tokens";
export let UrlGetAllContact = "api/auth/contacts";
export let UrlGetAllPurchaseOrder = "api/auth/purchase-orders";
export let UrlGetAllInventory = "api/auth/inventories";
export let UrlGetAllTransferIn = "api/auth/inventory/transfer-in/i/";
export let UrlGetWarehouseByToken = "api/auth/warehouses-list";
export let UrlGetAllStock = "api/auth/inventory/stocks";
export let UrlGetAllStockNew = "api/auth/stocks";
export let UrlGetAllSalesOrder = "api/auth/sales-orders";
export let UrlGetAllSKU = "api/auth/sales-order/all-sku/";
export let UrlGetDataBySKU = "/api/auth/sales-order";
export let UrlGetAllTransferOut = "api/auth/inventory/transfer-out/i/";
export let UrlGetAllInvoice = "api/auth/invoices";
export let UrlGetAllBill = "api/auth/bills";
export let UrlGetAllCommission = "api/auth/comissions";

// Endpoint Get By Id
export let UrlGetConvectionById = "api/auth/convection";
export let UrlGetUserById = "api/auth/user";
export let UrlGetStoreById = "api/auth/store";
export let UrlGetWarehouseById = "api/auth/warehouse";
export let UrlGetBankById = "api/auth/bank";
export let UrlGetTokenById = "api/auth/token";
export let UrlGetByIdContact = "api/auth/contact";
export let UrlGetByIdPurchaseOrder = "api/auth/purchase-order";
export let UrlGetInventoryById = "api/auth/inventory";
export let UrlGetTransferInById = "api/auth/inventory/transfer-in";
export let UrlGetStockAllById = "api/auth/inventory/stock";
export let UrlGetWarehouseByIdByToken = "api/auth/warehouse";
export let UrlGetSalesOrderById = "api/auth/sales-order";
export let UrlGetTransferOutById = "api/auth/inventory/transfer-out";
export let UrlGetInvoiceById = "api/auth/invoice";
export let UrlGetBillById = "api/auth/bill";
export let UrlGetCommissionById = "api/auth/commission";

// Endpoint Post
export let UrlPostLogin = "api/auth/login";
export let UrlBanUser = "api/auth/user/ban";
export let UrlUnbanUser = "api/auth/user/unban";
export let UrlBanStore = "api/auth/store/ban";
export let UrlUnbanStore = "api/auth/store/unban";
export let UrlBanConvection = "api/auth/convection/ban";
export let UrlUnbanConvection = "api/auth/convection/unban";
export let UrlBanWarehouse = "api/auth/warehouse/ban";
export let UrlUnbanWarehouse = "api/auth/warehouse/unban";
export let UrlPostStore = "api/auth/store";
export let UrlPostConvection = "api/auth/convection";
export let UrlPostWarehouse = "api/auth/warehouse";
export let UrlPostBank = "api/auth/bank";
export let UrlPostUser = "api/auth/register";
export let UrlLogoutUser = "api/auth/logout";
export let UrlPostToken = "api/auth/token/c";
export let UrlPostContact = "api/auth/contact";
export let UrlPostPurchaseOrder = "api/auth/purchase-order";
export let UrlPostFotoGithub =
  "https://api.github.com/repos/Bachtiar21/jpo_erp_adm/contents/static/fotoinput";
export let UrlPostTransferIn = "api/auth/inventory/transfer-in";
export let UrlPostSalesOrder = "api/auth/sales-order";
export let UrlPostStock = "api/auth/purchase-order";

// Endpoint Put
export let UrlPutStore = "api/auth/store/u";
export let UrlPutConvection = "api/auth/convection/u";
export let UrlPutWarehouse = "api/auth/warehouse/u";
export let UrlPutUser = "api/auth/user/update";
export let UrlPutBank = "api/auth/bank/u";
export let UrlPutToken = "api/auth/token/u";
export let UrlPutContact = "api/auth/contact/u";
export let UrlPutPurchaseOrder = "api/auth/purchase-order/u";
export let UrlPutTransferIn = "api/auth/inventory/transfer-in/u";
export let UrlReceivedTransferIn = "api/auth/inventory/transfer-in";
export let UrlPutSalesOrder = "api/auth/sales-order/u";
export let UrlSentTransferOut = "api/auth/inventory/transfer-out";
export let UrlPaidBill = "api/auth/bill";
export let UrlPaidInvoice = "api/auth/invoice";
export let UrlPaidCommission = "api/auth/commission";
export let UrlPutStock = "api/auth/inventory/stock/u";

// Endpoint Delete
export let UrlDeleteUser = "api/auth/user/d";
export let UrlDeleteStore = "api/auth/store/d";
export let UrlDeleteConvection = "api/auth/convection/d";
export let UrlDeleteWarehouse = "api/auth/warehouse/d";
export let UrlDeleteBank = "api/auth/bank/d";
export let UrlDeleteToken = "api/auth/token/d";
export let UrlDeleteContact = "api/auth/contact/d";
export let UrlDeletePurchaseOrder = "api/auth/purchase-order/d";
export let UrlDeleteTransferIn = "api/auth/purchase-order/d";
export let UrlDeleteSalesOrder = "api/auth/inventory/d";
export let UrlDeleteStock = "api/auth/inventory/stock/d";
