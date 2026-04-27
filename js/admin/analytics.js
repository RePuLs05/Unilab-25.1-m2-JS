const AnalyticsModule = (() => {
  const analyticsCardsContainer = document.querySelector(".js-analytics-cards");
  const ordersChart = document.querySelector(".js-orders-chart");
  const topProductsList = document.querySelector(".js-top-products");

  function totals() {
    const products = AdminStorage.getProducts();
    const orders = AdminStorage.getOrders();
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    return { products, orders, revenue };
  }

  function renderCards() {
    const { orders, revenue } = totals();
    const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;
    analyticsCardsContainer.innerHTML = `
      <article class="stat-card"><p>Sales Summary</p><h2>$${revenue}</h2></article>
      <article class="stat-card"><p>Orders Count</p><h2>${orders.length}</h2></article>
      <article class="stat-card"><p>Average Order Value</p><h2>$${avgOrder}</h2></article>
    `;
  }

  function renderOrdersPerDayChart() {
    const ctx = ordersChart.getContext("2d");
    ctx.clearRect(0, 0, ordersChart.width, ordersChart.height);

    const orders = AdminStorage.getOrders();
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    orders.forEach((order) => {
      const day = new Date(order.date).getDay();
      const index = day === 0 ? 6 : day - 1;
      counts[index] += 1;
    });

    const max = Math.max(...counts, 1);
    const barWidth = 50;
    const gap = 20;
    counts.forEach((value, index) => {
      const height = (value / max) * 160;
      const x = 40 + index * (barWidth + gap);
      const y = 200 - height;
      ctx.fillStyle = "#111827";
      ctx.fillRect(x, y, barWidth, height);
      ctx.fillStyle = "#6b7280";
      ctx.fillText(labels[index], x + 12, 225);
      ctx.fillText(String(value), x + 20, y - 6);
    });
  }

  function renderTopProducts() {
    const orders = AdminStorage.getOrders();
    const counts = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + item.qty;
      });
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    topProductsList.innerHTML = sorted.length
      ? sorted.map(([name, qty]) => `<li>${name} - ${qty} sold</li>`).join("")
      : "<li>No order data yet.</li>";
  }

  function render() {
    renderCards();
    renderOrdersPerDayChart();
    renderTopProducts();
  }

  return { render };
})();
