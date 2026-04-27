const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));
const productList = window.shopData ? window.shopData.getProducts() : products;

function showAddToCartNotification(message) {
  const existingToast = document.querySelector(".js-add-to-cart-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "js-add-to-cart-toast";
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.right = "20px";
  toast.style.bottom = "20px";
  toast.style.backgroundColor = "#111827";
  toast.style.color = "#ffffff";
  toast.style.padding = "12px 16px";
  toast.style.borderRadius = "10px";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "600";
  toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(8px)";
  toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 1800);
}

// Find the product with the matching ID
const product = productList.find((p) => p.id === productId);
console.log("Product ID:", productId);
console.log("Product data:", product);

// Update the product detail page with the product data
if (product) {
  const ratingImage = `./images/rating-${
    Math.round(product.rating * 2) * 5
  }.png`;

  // Update the page title
  document.title = `${product.name} - SHOP.CO`;

  // Update the product image (if available)
  const mainProductImage = document.querySelector(".hero-category-img img");
  if (mainProductImage) {
    mainProductImage.src = product.img;
    mainProductImage.alt = product.name;
  }

  const productHtml = `
    <article class="product-info">
      <h2>${product.name}</h2>

      <section class="rating">
        <img src="${ratingImage}" alt="Star" />
        <span>${product.rating}/5</span>
      </section>

      <div class="product-price">
        ${
          product.discount
            ? `
          <span class="discounted-price">$${product.priceCent}</span>
          <span class="old-price">$${product.oldPrice}</span>
          <span class="discount-tag">-${product.discount}%</span>
        `
            : `
          <span class="discounted-price">$${product.priceCent}</span>
        `
        }
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde vel in ad ipsum.
        </p>
      </div>

      <hr />

      <section class="colors">
        <p>Color:</p>
        <div class="color-options">
          <div class="color-circle black"></div>
          <div class="color-circle navy"></div>
          <div class="color-circle olive"></div>
        </div>
      </section>

      <hr />

      <section class="sizes">
        <p>Size:</p>
        <div class="size-options">
          <button>Small</button>
          <button>Medium</button>
          <button>Large</button>
          <button>X-Large</button>
        </div>
      </section>

      <hr />
      <input type="number" value="1" min="1" class="actions" />
      <button class="add-to-cart">Add to Cart</button>
    </article>
  `;

  document.querySelector(".hero-category-info").innerHTML = productHtml;

  // Add event listener to the Add to Cart button-------------------------------------------------------------------------
  const addToCartButton = document.querySelector(".add-to-cart");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      const rawQuantity = parseInt(document.querySelector(".actions").value, 10);
      const quantity = Number.isNaN(rawQuantity) || rawQuantity < 1 ? 1 : rawQuantity;

      // მოიძიე არსებული კალათა
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      // მოძებნე უკვე არსებული პროდუქტი
      let matchingItem = cart.find((item) => item.productId === productId);

      if (matchingItem) {
        matchingItem.quantity += quantity;
      } else {
        cart.push({
          productId: productId,
          quantity: quantity,
          name: product.name,
          price: product.priceCent,
          image: product.img,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Updated cart:", cart);
      showAddToCartNotification(
        `${quantity} x ${product.name} added to cart`
      );
    });
  }
} else {
  document.querySelector(".hero-category-info").innerHTML =
    "<h2>Product not found</h2>";
}
//----------------------------------------------------------------------------------
let costumerCommentHtml = ``;
costumers.forEach((costumers) => {
  costumerCommentHtml += `
      <section class="carousel-item">
              <img src="./images/rating-50.png" alt="Star">
              <p class="customer-name">
                ${costumers.name}
                <img src="./images/main-page-img/check.png" alt="check" />
              </p>
              <p class="customer-review">
                ${costumers.coment}
              </p>
               <p class="date">${costumers.date}</p>
            </section>
  `;
});

document.querySelectorAll(".review-grid").forEach((container) => {
  container.innerHTML = costumerCommentHtml;
});

let productHtml = ``;

// Only process the first 4 products using slice(0, 4)
productList.slice(0, 4).forEach((product) => {
  const ratingImage = `./images/rating-${
    Math.round(product.rating * 2) * 5
  }.png`;

  productHtml += `
  <a href="./ProductDetailPage.html?id=${product.id}">
    <div class="product-container">
      <div class="product-image-container">
        <img
          class="product-image"
          src="${product.img}"
        />
      </div>

      <div class="product-name ">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img
          class="product-rating-stars"
          src="${ratingImage}"
        />
        <div class="product-rating-count">${product.rating}/5</div>
      </div>
      </a>
  `;

  if ("discount" in product && "oldPrice" in product) {
    productHtml += `
      <div class="product-price">
        <span class="discounted-price">$${product.priceCent}</span>
        <span class="old-price">$${product.oldPrice}</span>
        <span class="discount-tag">-${product.discount}%</span>
      </div>
    `;
  } else {
    productHtml += `
      <div class="product-price">$${product.priceCent}</div>
    `;
  }

  productHtml += `</div>`;
});

document.querySelectorAll(".js-products-container").forEach((container) => {
  container.innerHTML = productHtml;
});

// Review Modal JavaScript
