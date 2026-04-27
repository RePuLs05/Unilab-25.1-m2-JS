const CustomerModule = (() => {
  const tableBody = document.querySelector(".js-customers-table-body");

  function list() {
    return AdminStorage.getCustomers();
  }

  function countOrders(customerId) {
    const orders = AdminStorage.getOrders();
    return orders.filter((order) => order.customerId === customerId).length;
  }

  function render() {
    const customers = list();
    if (!customers.length) {
      tableBody.innerHTML = `<tr><td colspan="5" class="empty">No customers found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = customers
      .map(
        (customer) => `
        <tr>
          <td>${customer.name}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
          <td>${countOrders(customer.id)}</td>
          <td>
            <div class="inline-actions">
              <button class="btn secondary js-view-customer" data-id="${customer.id}">Details</button>
              <button class="btn danger js-delete-customer" data-id="${customer.id}">Delete</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");
  }

  function showDetails(id) {
    const customer = list().find((item) => item.id === id);
    if (!customer) return;
    const orders = AdminStorage.getOrders().filter((order) => order.customerId === id);
    AdminUI.openModal(`
      <h3>${customer.name}</h3>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Phone:</strong> ${customer.phone}</p>
      <h4>Orders (${orders.length})</h4>
      <ul>${orders.map((order) => `<li>#${order.id} - ${order.status} - $${order.total}</li>`).join("") || "<li>No orders.</li>"}</ul>
      <button class="btn secondary js-close-modal">Close</button>
    `);
    document.querySelector(".js-close-modal")?.addEventListener("click", AdminUI.closeModal);
  }

  function remove(id) {
    const remaining = list().filter((item) => item.id !== id);
    AdminStorage.saveCustomers(remaining);
    AdminUI.showToast("Customer deleted");
    render();
    DashboardModule.renderOverview();
  }

  function handleClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = Number(target.dataset.id);
    if (!id) return;

    if (target.classList.contains("js-view-customer")) {
      showDetails(id);
    }
    if (target.classList.contains("js-delete-customer")) {
      AdminUI.confirmAction("Delete this customer?", () => remove(id));
    }
  }

  function init() {
    tableBody?.addEventListener("click", handleClick);
    render();
  }

  return { init, render };
})();
