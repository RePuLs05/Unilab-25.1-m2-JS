const ProductModule = (() => {
  const tableBody = document.querySelector(".js-products-table-body");
  const searchInput = document.querySelector(".js-product-search");
  const categoryFilter = document.querySelector(".js-product-category-filter");
  const pagination = document.querySelector(".js-product-pagination");
  const openProductModalBtn = document.querySelector(".js-open-product-modal");

  const PAGE_SIZE = 6;
  let currentPage = 1;

  function list() {
    return AdminStorage.getProducts();
  }

  function nextId(items) {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  function productFormHTML(product = {}) {
    return `
      <h3>${product.id ? "Edit Product" : "Add Product"}</h3>
      <form class="product-form js-product-form">
        <input type="hidden" name="id" value="${product.id || ""}" />
        <label>Name<input name="name" class="input" value="${product.name || ""}" required /></label>
        <div class="grid-2">
          <label>Category
            <select name="category" class="input">
              <option ${product.category === "T-shirt" ? "selected" : ""}>T-shirt</option>
              <option ${product.category === "Hoodie" ? "selected" : ""}>Hoodie</option>
              <option ${product.category === "Jeans" ? "selected" : ""}>Jeans</option>
              <option ${product.category === "Shirt" ? "selected" : ""}>Shirt</option>
            </select>
          </label>
          <label>Stock<input name="stock" class="input" type="number" min="0" value="${product.stock ?? 0}" required /></label>
        </div>
        <div class="grid-2">
          <label>Price<input name="priceCent" class="input" type="number" min="1" value="${product.priceCent || ""}" required /></label>
          <label>Discount<input name="discount" class="input" type="number" min="0" max="99" value="${product.discount || ""}" /></label>
        </div>
        <label>Sizes (comma separated)<input name="sizes" class="input" value="${(product.sizes || ["S", "M", "L", "XL"]).join(", ")}" /></label>
        <label>Colors (comma separated)<input name="colors" class="input" value="${(product.colors || ["Black"]).join(", ")}" /></label>
        <label>Image URL<input name="img" class="input js-image-url" value="${product.img || ""}" required /></label>
        <div class="dropzone js-dropzone">Drag & drop image URL text here (UI only)</div>
        <img class="img-preview js-img-preview" src="${product.img || "./images/main-page-img/T-SHIRT WITH TAPE DETAILS.png"}" alt="preview" />
        <label>Description<textarea name="description" class="input">${product.description || ""}</textarea></label>
        <div class="inline-actions">
          <button class="btn primary js-save-product">${product.id ? "Update" : "Create"}</button>
          <button type="button" class="btn secondary js-close-modal">Cancel</button>
        </div>
      </form>
    `;
  }

  function filteredProducts() {
    const text = (searchInput?.value || "").toLowerCase();
    const category = categoryFilter?.value || "";
    return list().filter((item) => {
      const matchesText = item.name.toLowerCase().includes(text);
      const matchesCategory = !category || item.category === category;
      return matchesText && matchesCategory;
    });
  }

  function render() {
    const items = filteredProducts();
    if (!items.length) {
      tableBody.innerHTML = `<tr><td colspan="7" class="empty">No products found.</td></tr>`;
      pagination.innerHTML = "";
      return;
    }

    const totalPages = Math.ceil(items.length / PAGE_SIZE);
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);

    tableBody.innerHTML = pageItems
      .map(
        (product) => `
        <tr>
          <td>${product.id}</td>
          <td><img class="thumb" src="${product.img}" alt="${product.name}" /></td>
          <td>${product.name}</td>
          <td>${product.category || "-"}</td>
          <td>$${product.priceCent}</td>
          <td>${product.stock ?? 0}</td>
          <td>
            <div class="inline-actions">
              <button class="btn secondary js-edit-product" data-id="${product.id}">Edit</button>
              <button class="btn danger js-delete-product" data-id="${product.id}">Delete</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("");

    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i += 1) {
      const btn = document.createElement("button");
      btn.className = "btn secondary";
      btn.textContent = String(i);
      btn.disabled = i === currentPage;
      btn.addEventListener("click", () => {
        currentPage = i;
        render();
      });
      pagination.appendChild(btn);
    }
  }

  function saveFromForm(form) {
    const data = new FormData(form);
    const all = list();
    const id = Number(data.get("id")) || nextId(all);
    const payload = {
      id,
      name: String(data.get("name")),
      category: String(data.get("category")),
      priceCent: Number(data.get("priceCent")),
      discount: Number(data.get("discount")) || undefined,
      stock: Number(data.get("stock")),
      sizes: String(data.get("sizes")).split(",").map((item) => item.trim()).filter(Boolean),
      colors: String(data.get("colors")).split(",").map((item) => item.trim()).filter(Boolean),
      img: String(data.get("img")),
      description: String(data.get("description")),
      rating: 4.5,
      coment: "new",
    };

    const existingIndex = all.findIndex((item) => item.id === id);
    if (existingIndex >= 0) {
      all[existingIndex] = { ...all[existingIndex], ...payload };
    } else {
      all.push(payload);
    }

    AdminStorage.saveProducts(all);
    AdminUI.showToast("Product saved");
    AdminUI.closeModal();
    render();
    DashboardModule.renderOverview();
    AnalyticsModule.render();
  }

  function bindModalEvents(product) {
    AdminUI.openModal(productFormHTML(product));
    const form = document.querySelector(".js-product-form");
    const closeBtn = document.querySelector(".js-close-modal");
    const imageInput = document.querySelector(".js-image-url");
    const imagePreview = document.querySelector(".js-img-preview");
    const dropzone = document.querySelector(".js-dropzone");

    imageInput.addEventListener("input", () => {
      imagePreview.src = imageInput.value;
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.add("dragging");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.remove("dragging");
      });
    });

    dropzone.addEventListener("drop", (event) => {
      const text = event.dataTransfer.getData("text");
      if (text && text.startsWith("http")) {
        imageInput.value = text;
        imagePreview.src = text;
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const saveButton = form.querySelector(".js-save-product");
      saveButton.disabled = true;
      setTimeout(() => saveFromForm(form), 400);
    });

    closeBtn.addEventListener("click", AdminUI.closeModal);
  }

  function handleTableActions(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = Number(target.dataset.id);
    if (!id) return;

    const items = list();
    if (target.classList.contains("js-edit-product")) {
      const selected = items.find((item) => item.id === id);
      bindModalEvents(selected);
    }

    if (target.classList.contains("js-delete-product")) {
      AdminUI.confirmAction("Delete this product?", () => {
        const updated = items.filter((item) => item.id !== id);
        AdminStorage.saveProducts(updated);
        AdminUI.showToast("Product deleted");
        render();
        DashboardModule.renderOverview();
        AnalyticsModule.render();
      });
    }
  }

  function init() {
    openProductModalBtn?.addEventListener("click", () => bindModalEvents());
    tableBody?.addEventListener("click", handleTableActions);
    searchInput?.addEventListener("input", () => {
      currentPage = 1;
      render();
    });
    categoryFilter?.addEventListener("change", () => {
      currentPage = 1;
      render();
    });
    render();
  }

  return { init, render };
})();
