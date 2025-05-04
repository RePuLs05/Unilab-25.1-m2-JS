const cart = JSON.parse(localStorage.getItem("cart")) || [];

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
    <button class="remove-btn">✕</button>
  </section>
`;

function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.querySelector(".cart-items");
  if (!container) return;

  const html = cart.map(generateCartItemHtml).join("");
  container.innerHTML = html;

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
      setupRemoveButtons(); // ხელახლა დავაბინდოთ ღილაკები
    });
  });
}
