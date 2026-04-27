const SettingsModule = (() => {
  const form = document.querySelector(".js-settings-form");
  const storeName = document.querySelector(".js-store-name");
  const adminEmail = document.querySelector(".js-admin-email");
  const currency = document.querySelector(".js-currency");
  const theme = document.querySelector(".js-theme");
  const exportButton = document.querySelector(".js-export-json");

  function applyTheme(themeValue) {
    document.body.classList.toggle("dark", themeValue === "dark");
  }

  function render() {
    const settings = AdminStorage.getSettings();
    storeName.value = settings.storeName || "SHOP.CO";
    adminEmail.value = settings.adminEmail || "admin@shopco.com";
    currency.value = settings.currency || "USD";
    theme.value = settings.theme || "light";
    applyTheme(theme.value);
  }

  function onSubmit(event) {
    event.preventDefault();
    const saveBtn = document.querySelector(".js-save-settings");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    setTimeout(() => {
      const settings = {
        storeName: storeName.value.trim(),
        adminEmail: adminEmail.value.trim(),
        currency: currency.value,
        theme: theme.value,
      };
      AdminStorage.saveSettings(settings);
      applyTheme(settings.theme);
      AdminUI.showToast("Settings saved");
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Settings";
    }, 350);
  }

  function exportJson() {
    const payload = {
      products: AdminStorage.getProducts(),
      orders: AdminStorage.getOrders(),
      customers: AdminStorage.getCustomers(),
      settings: AdminStorage.getSettings(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shopco-admin-export.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    AdminUI.showToast("Data exported");
  }

  function init() {
    render();
    form?.addEventListener("submit", onSubmit);
    exportButton?.addEventListener("click", exportJson);
  }

  return { init, render };
})();
