const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

const product = products.find((p) => p.id === productId);
console.log(product);
// Step 4: ჩასვი მონაცემები html-ში
if (product) {
  const ratingImage = `./images/rating-${
    Math.round(product.rating * 2) * 5
  }.png`;

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
} else {
  document.querySelector(".hero-category-info").innerHTML =
    "<h2>Product not found</h2>";
}
