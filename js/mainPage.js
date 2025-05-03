const scrollers = document.querySelectorAll(".scroller");
// Check if the user has a preference for reduced motion
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  addAnimation();
}
function addAnimation() {
  scrollers.forEach((scroller) => {
    // add data-animated="true" to every `.scroller` on the page
    scroller.setAttribute("data-animated", true);
    // add data-animated="true" to every `.scroller__inner` on the page
    const scrollerInner = scroller.querySelector(".scroller__inner");
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

let costumerHtml = ``;
costumers.forEach((costumers) => {
  costumerHtml += `
      <section class="carousel-item">
              <img src="./images/rating-50.png" alt="Star">
              <p class="customer-name">
                ${costumers.name}
                <img src="./images/main-page-img/check.png" alt="check" />
              </p>
              <p class="customer-review">
                ${costumers.coment}
              </p>
            </section>
  `;
});

document.querySelectorAll(".js-carousel").forEach((container) => {
  container.innerHTML = costumerHtml;
});
const carousel = document.querySelector(".js-carousel");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

// Adjust based on .carousel-item width + gap (400px width + 20px gap)
const scrollAmount = 310;

nextBtn.addEventListener("click", () => {
  carousel.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
});

prevBtn.addEventListener("click", () => {
  carousel.scrollBy({
    left: -scrollAmount,
    behavior: "smooth",
  });
});

//produqtebis gamoiyeneba

let productHtml = ``;

// Only process the first 4 products using slice(0, 4)
products.slice(0, 4).forEach((product) => {
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

let topSellingHtml = ``;

// Only process elements from index 4 to 7 (fifth to eighth products) using slice(4, 8)
products.slice(4, 8).forEach((product) => {
  const ratingImage = `./images/rating-${
    Math.round(product.rating * 2) * 5
  }.png`;

  topSellingHtml += `
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
    topSellingHtml += `
      <div class="product-price">
        <span class="discounted-price">$${product.priceCent}</span>
        <span class="old-price">$${product.oldPrice}</span>
        <span class="discount-tag">-${product.discount}%</span>
      </div>
    `;
  } else {
    topSellingHtml += `
      <div class="product-price">$${product.priceCent}</div>
    `;
  }

  topSellingHtml += `</div>`;
});

document
  .querySelectorAll(".js-products-container-top-selling")
  .forEach((container) => {
    container.innerHTML = topSellingHtml;
  });