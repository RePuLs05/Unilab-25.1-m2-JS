const AdminStorage = (() => {
  const KEYS = {
    products: "shopco_products",
    orders: "shopco_admin_orders",
    customers: "shopco_admin_customers",
    settings: "shopco_admin_settings",
  };

  function read(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seed() {
    const products = window.shopData
      ? window.shopData.getProducts()
      : read(KEYS.products, []);

    if (!read(KEYS.customers, null)) {
      write(KEYS.customers, [
        { id: 1, name: "Nina Carter", email: "nina@mail.com", phone: "+995 555 11 22 33" },
        { id: 2, name: "Leo James", email: "leo@mail.com", phone: "+995 555 44 55 66" },
        { id: 3, name: "Ana Lopez", email: "ana@mail.com", phone: "+995 555 77 88 99" },
      ]);
    }

    if (!read(KEYS.orders, null)) {
      write(KEYS.orders, [
        {
          id: 1001,
          customerId: 1,
          customerName: "Nina Carter",
          items: [{ name: products[0]?.name || "T-shirt", qty: 2, price: products[0]?.priceCent || 120 }],
          total: (products[0]?.priceCent || 120) * 2,
          status: "Pending",
          date: new Date().toISOString(),
        },
        {
          id: 1002,
          customerId: 2,
          customerName: "Leo James",
          items: [{ name: products[1]?.name || "Jeans", qty: 1, price: products[1]?.priceCent || 180 }],
          total: products[1]?.priceCent || 180,
          status: "Shipped",
          date: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    }

    if (!read(KEYS.settings, null)) {
      write(KEYS.settings, {
        storeName: "SHOP.CO",
        adminEmail: "admin@shopco.com",
        currency: "USD",
        theme: "light",
      });
    }
  }

  const api = {
    keys: KEYS,
    seed,
    getProducts: () => read(KEYS.products, []),
    saveProducts: (products) => {
      if (window.shopData) {
        window.shopData.saveProducts(products);
      } else {
        write(KEYS.products, products);
      }
    },
    getOrders: () => read(KEYS.orders, []),
    saveOrders: (orders) => write(KEYS.orders, orders),
    getCustomers: () => read(KEYS.customers, []),
    saveCustomers: (customers) => write(KEYS.customers, customers),
    getSettings: () => read(KEYS.settings, {}),
    saveSettings: (settings) => write(KEYS.settings, settings),
  };

  return api;
})();
