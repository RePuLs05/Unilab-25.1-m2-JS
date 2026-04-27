const DashboardModule = (() => {
  const navLinks = document.querySelectorAll(".js-nav-link");
  const sections = document.querySelectorAll(".js-section");
  const sectionTitle = document.querySelector(".js-section-title");
  const overviewCards = document.querySelector(".js-overview-cards");
  const activityList = document.querySelector(".js-activity-list");
  const salesChart = document.querySelector(".js-sales-chart");
  const logoutButton = document.querySelector(".js-logout-btn");

  function totalRevenue() {
    return AdminStorage.getOrders().reduce((sum, order) => sum + order.total, 0);
  }

  function renderOverview() {
    const products = AdminStorage.getProducts();
    const orders = AdminStorage.getOrders();
    const customers = AdminStorage.getCustomers();
    const revenue = totalRevenue();

    overviewCards.innerHTML = `
      <article class="stat-card"><p>Total Products</p><h2>${products.length}</h2></article>
      <article class="stat-card"><p>Total Orders</p><h2>${orders.length}</h2></article>
      <article class="stat-card"><p>Total Revenue</p><h2>$${revenue}</h2></article>
      <article class="stat-card"><p>Total Customers</p><h2>${customers.length}</h2></article>
    `;

    activityList.innerHTML = [
      `Products loaded: ${products.length}`,
      `Orders updated: ${orders.length}`,
      `Revenue recalculated: $${revenue}`,
      `Customers synced: ${customers.length}`,
    ]
      .map((line) => `<li>${line}</li>`)
      .join("");

    renderSalesChart();
  }

  function renderSalesChart() {
    const ctx = salesChart.getContext("2d");
    ctx.clearRect(0, 0, salesChart.width, salesChart.height);

    const orders = AdminStorage.getOrders();
    const totals = [0, 0, 0, 0, 0, 0, 0];
    orders.forEach((order) => {
      const day = new Date(order.date).getDay();
      const index = day === 0 ? 6 : day - 1;
      totals[index] += order.total;
    });

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const max = Math.max(...totals, 1);
    const xStep = 80;

    const points = totals.map((value, index) => ({
      x: 40 + index * xStep,
      y: 200 - (value / max) * 150,
      value,
      label: labels[index],
    }));

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    points.forEach((point) => {
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6b7280";
      ctx.fillText(point.label, point.x - 10, 230);
      ctx.fillText(`$${point.value}`, point.x - 12, point.y - 8);
    });
  }

  function switchSection(section) {
    sections.forEach((el) => {
      el.classList.toggle("hidden", el.dataset.section !== section);
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === section);
    });

    sectionTitle.textContent =
      section.charAt(0).toUpperCase() + section.slice(1);
  }

  function initNav() {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        switchSection(link.dataset.section);
      });
    });
  }

  function init() {
    AdminAuth.requireAuth();
    AdminStorage.seed();

    initNav();
    renderOverview();

    ProductModule.init();
    OrderModule.init();
    CustomerModule.init();
    AnalyticsModule.render();
    SettingsModule.init();

    logoutButton?.addEventListener("click", () => {
      AdminAuth.logout();
      window.location.href = "./admin-login.html";
    });
  }

  return { init, renderOverview };
})();

DashboardModule.init();
