const generateCartItemHtml = (product) => `
  <section class="cart-item">
    <section class="item-image">
      <img src="${product.image}" alt="${product.name}" />
    </section>
    <section class="item-details">
      <section class="item-title">${product.name}</section>
      <section class="item-price">$${product.price}</section>
      <section class="item-attributes">Quantity: ${product.quantity}</section>
    </section>
    <button class="remove-btn"><img src="./images/rubbish-bin.png" alt="remove"></button>
  </section>
`;

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

function renderOrderSummary(cartItems) {
  const subtotalElement = document.querySelector(".js-subtotal");
  const discountElement = document.querySelector(".js-discount");
  const deliveryElement = document.querySelector(".js-delivery");
  const totalElement = document.querySelector(".js-total");

  if (!subtotalElement || !discountElement || !deliveryElement || !totalElement) {
    return;
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const discountRate = 0.2;
  const discountValue = subtotal * discountRate;
  const deliveryFee = cartItems.length > 0 ? 15 : 0;
  const total = subtotal - discountValue + deliveryFee;

  subtotalElement.textContent = formatMoney(subtotal);
  discountElement.textContent = `-${formatMoney(discountValue)}`;
  deliveryElement.textContent = formatMoney(deliveryFee);
  totalElement.textContent = formatMoney(total);
}

function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.querySelector(".cart-items");
  if (!container) return;

  const html = cart.map(generateCartItemHtml).join("");
  container.innerHTML = html;

  renderOrderSummary(cart);
  setupRemoveButtons();
}

renderCartItems();

function setupRemoveButtons() {
  const removeButtons = document.querySelectorAll(".remove-btn");

  removeButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // წაშალე პროდუქტი ინდექსის მიხედვით
      cart.splice(index, 1);

      // განაახლე localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // თავიდან გამოიძახე UI განახლებისთვის
      renderCartItems();
    });
  });
}
