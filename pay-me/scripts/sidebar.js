//Mostrar menú en todas las pantallas
function loadSidebar() {
  fetch("sidebar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar la barra lateral");
      }
      return response.text();
    })
    .then((html) => {
      document.querySelector(".sidebar-container").innerHTML = html;

      initializeSidebarNavigation();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//Funcion navegación entre paneles
function initializeSidebarNavigation() {
  const currentPath = window.location.pathname.split("/").pop();
  const buttons = document.querySelectorAll(".btns-menu button");

  buttons.forEach((button) => {
    const link = button.getAttribute("data-link");

    if (link === currentPath) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      navigateTo(link);
    });
  });

  //Redirigiar al Dashboard al hacer clic en el logo
  const logo = document.querySelector(".sidebar h1");
  if (logo) {
    const dashboardLink = logo.getAttribute("data-link");
    logo.addEventListener("click", () => {
      navigateTo(dashboardLink);
    });
  }
}

function navigateTo(url) {
  window.location.href = url;
}
const sessionInfo = JSON.parse(localStorage.getItem("sessionInfo"));
if (!sessionInfo) {
  window.location.href = "./login_registro.html";
}

const infoUser = JSON.parse(localStorage.getItem("infoUser"));
const API_URL = "http://localhost:3000";

const formMakeTransfer = document.getElementById("formMakeTransfer");
if (formMakeTransfer) {
  formMakeTransfer.addEventListener("submit", async (event) => {
    event.preventDefault();
    const session = JSON.parse(localStorage.getItem("sessionInfo"));
    const infoUser = session.userInfo;
    const recipientEmail = document.getElementById("recipientEmail").value;
    const amount = document.getElementById("amount").value;
    const message = document.getElementById("message").value;
    const res = await fetch(`${API_URL}/transfers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: infoUser.user_id,
        recipient_email: recipientEmail,
        amount,
        message,
      }),
    });
    const data = await res.json();
    if (data.error && data.error.length > 0) {
      alert(`${data.message}: ${data.error}`);
    } else {
      alert(data.message);
    }
  });
}
const formAddCard = document.getElementById("formAddCard");

if (formAddCard) {
  formAddCard.addEventListener("submit", async (event) => {
    event.preventDefault();
    const cardNumber = document.getElementById("cardNumber").value;
    const expirationDate = document.getElementById("expirationDate").value;
    const cvv = document.getElementById("cvv").value;
    const cardType = document.getElementById("cardType").value;
    const card_holder = document.getElementById("card_holder").value;
    const sessionInfo = JSON.parse(localStorage.getItem("sessionInfo"));
    const { user_id } = sessionInfo.userInfo;

    const res = await fetch(`${API_URL}/addCards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        card_number: cardNumber,
        card_holder,
        expiration_date: expirationDate,
        card_type: cardType,
        cvv,
      }),
    });
    const data = await res.json();
    if (data.error && data.error.length > 0) {
      alert(`${data.message}: ${data.error}`);
    } else {
      alert(data.message);
    }
  });
}

const formMakePayment = document.getElementById("formMakePayment");

if (formMakePayment) {
  formMakePayment.addEventListener("submit", async (event) => {
    event.preventDefault();
    const amount = document.getElementById("paymentAmount").value;
    const institution = document.getElementById("institution").value;
    const paymentConcept = document.getElementById("description").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const sessionInfo = JSON.parse(localStorage.getItem("sessionInfo"));
    const { user_id } = sessionInfo.userInfo;

    const res = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        amount,
        institution,
        payment_concept: paymentConcept,
        paymentMethod,
      }),
    });
    const data = await res.json();
    if (data.error && data.error.length > 0) {
      alert(`${data.message}: ${data.error}`);
    } else {
      alert(data.message);
    }
  });
}

const movementsTable = document.getElementById("movements-table");

if (movementsTable) {
  document.addEventListener("DOMContentLoaded", () => {
    rechargeMovements();
    document.getElementById("filter-date").addEventListener("change", (e) => {
      if (e.target.value !== "") {
        rechargeMovements();
      }
    });
    document.getElementById("filter-type").addEventListener("change", (e) => {
      rechargeMovements();
    });
  });
}

async function rechargeMovements() {
  (async () => {
    const sessionInfo = JSON.parse(localStorage.getItem("sessionInfo"));
    const { user_id } = sessionInfo.userInfo;
    const filterFecha = document.getElementById("filter-date");
    const filterType = document.getElementById("filter-type");
    const transactionsURLParamsFilters = new URLSearchParams();
    transactionsURLParamsFilters.append("user_id", user_id);
    if (filterFecha?.value !== "" && filterFecha?.value !== "null") {
      transactionsURLParamsFilters.append("date", filterFecha?.value);
    }
    if (filterType?.value !== "" && filterType?.value !== "null") {
      transactionsURLParamsFilters.append("type", filterType?.value);
    }

    const res = await fetch(
      `${API_URL}/transactions?${transactionsURLParamsFilters.toString()}`
    );
    const data = await res.json();
    if (data.error && data.error.length > 0) {
      alert(`${data.message}: ${data.error}`);
    } else {
      const transactions = data.data;
      const tbody = document.getElementById("transactions-table-tbody");
      tbody.innerHTML = "";
      const row = document.querySelector(".empty-state");
      if (transactions.length === 0) {
        row.style.display = "block";
      } else {
        row.style.display = "none";
      }
      transactions.forEach((transaction) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${transaction.transaction_id}</td>
      <td>${transaction.amount}</td>
      <td>${transaction.message}</td>
      <td>${transaction.status}</td>
      <td>${Intl.DateTimeFormat("es-CO", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(transaction.created_at))}</td>
      </td>
    `;
        tbody.appendChild(row);
      });
    }
  })();
}
document.addEventListener("DOMContentLoaded", loadSidebar);

// const btnCerrarSesion = document.getElementById("cerrar-session-btn");

// btnCerrarSesion.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log("asdasd");
//   localStorage.removeItem("sessionInfo");
//   window.location.href = "./login_registro.html";
// });

const infoAccountContainer = document.getElementById("info-account");

if (infoAccountContainer) {
  (async () => {
    const balanceEl = document.getElementById("balance-account");
    const totalIncomesEl = document.getElementById("total-incomes");
    const totalSpentEl = document.getElementById("total-spent");
    const session = JSON.parse(localStorage.getItem("sessionInfo"));
    const infoUser = session.userInfo;
    const resInfoAccount = await fetch(
      `${API_URL}/accounts/${infoUser.user_id}`
    );

    const dataInfoAccount = await resInfoAccount.json();
    if (dataInfoAccount.error && dataInfoAccount.error.length > 0) {
      alert(`${dataInfoAccount.message}: ${dataInfoAccount.error}`);
    } else {
      const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        currencyDisplay: "code",
      });
      const infoAccount = dataInfoAccount.data;
      balanceEl.textContent = formatter.format(infoAccount.balance);
      totalIncomesEl.textContent = formatter.format(infoAccount.total_incomes);
      totalSpentEl.textContent = formatter.format(infoAccount.total_spent);
    }
  })();
}

const addButtonOpenModalForm = document.getElementById("add-button");
if (addButtonOpenModalForm) {
  addButtonOpenModalForm.addEventListener("click", () => {
    const cerrarModal = document.getElementById("cerrar-modal");
    const modal = document.getElementById("modal-form");
    modal.style.display = "block";
    cerrarModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  });
}

const card_id_input = document.getElementById("card_id");

if (card_id_input) {
  (async () => {
    const session = JSON.parse(localStorage.getItem("sessionInfo"));
    const infoUser = session.userInfo;
    const res = await fetch(`${API_URL}/cards/${infoUser.user_id}`);
    const data = await res.json();
    if (data.error && data.error.length > 0) {
      alert(`${data.message}: ${data.error}`);
    } else {
      const cards = data.data;
      const select = document.getElementById("card_id");
      cards.forEach((card) => {
        const option = document.createElement("option");
        option.value = card.card_id;
        option.textContent = card.card_number;
        select.appendChild(option);
      });
    }
  })();
}

const formAddFundToAccount = document.getElementById("formAddFundToAccount");

if (formAddFundToAccount) {
  formAddFundToAccount.addEventListener("submit", async (event) => {
    event.preventDefault();
    const amount = document.getElementById("paymentAmount").value;
    const card_id = document.getElementById("card_id").value;
    const sessionInfo = JSON.parse(localStorage.getItem("sessionInfo"));
    const { user_id } = sessionInfo.userInfo;

    const res = await fetch(`${API_URL}/addFunds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        amount,
        card_id,
      }),
    });
    const data = await res.json();
    if (data.error && data.error.length > 0) {
      alert(`${data.message}: ${data.error}`);
    } else {
      alert(data.message);
      window.location.reload();
    }
  });
}
