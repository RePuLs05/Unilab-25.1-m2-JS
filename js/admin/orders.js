const OrderModule = (() => {
  const tableBody = document.querySelector(".js-orders-table-body");
  const statuses = ["Pending", "Processing", "Shipped", "Delivered"];

  function list() {
    return AdminStorage.getOrders();
  }

  function save(orders) {
    AdminStorage.saveOrders(orders);
  }

  function statusClassName(status) {
    return status.toLowerCase();
  }

  function render() {
    const orders = list();
    if (!orders.length) {
      tableBody.innerHTML = `<tr><td colspan="6" class="empty">No orders yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = orders
      .map((order) => {
        const productNames = order.items.map((item) => `${item.name} x${item.qty}`).join(", ");
        return `
          <tr>
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>${productNames}</td>
            <td>$${order.total}</td>
            <td><span class="tag ${statusClassName(order.status)}">${order.status}</span></td>
            <td>
              <div class="inline-actions">
                <select class="input js-update-status" data-id="${order.id}">
                  ${statuses
                    .map((status) => `<option ${order.status === status ? "selected" : ""}>${status}</option>`)
                    .join("")}
                </select>
                <button class="btn secondary js-view-order" data-id="${order.id}">Details</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function showDetails(orderId) {
    const order = list().find((item) => item.id === orderId);
    if (!order) return;
    AdminUI.openModal(`
      <h3>Order #${order.id}</h3>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Total:</strong> $${order.total}</p>
      <h4>Items</h4>
      <ul>${order.items.map((item) => `<li>${item.name} - Qty: ${item.qty} - $${item.price}</li>`).join("")}</ul>
      <button class="btn secondary js-close-modal">Close</button>
    `);
    document.querySelector(".js-close-modal")?.addEventListener("click", AdminUI.closeModal);
  }

  function handleChanges(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.classList.contains("js-update-status")) {
      const orderId = Number(target.dataset.id);
      const orders = list();
      const selected = orders.find((order) => order.id === orderId);
      if (!selected) return;
      selected.status = target.value;
      save(orders);
      AdminUI.showToast("Order status updated");
      render();
      DashboardModule.renderOverview();
      AnalyticsModule.render();
    }

    if (target.classList.contains("js-view-order")) {
      showDetails(Number(target.dataset.id));
    }
  }

  function init() {
    tableBody?.addEventListener("change", handleChanges);
    tableBody?.addEventListener("click", handleChanges);
    render();
  }

  return { init, render };
})();
