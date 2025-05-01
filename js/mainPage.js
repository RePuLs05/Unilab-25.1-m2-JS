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

const products = [
  {
    img: "./images/main-page-img/T-SHIRT WITH TAPE DETAILS.png",
    name: "T-SHIRT WITH TAPE DETAILS",
    rating: 4.5,
    priceCent: 120,
  },
  {
    img: "./images/main-page-img/SKINNY FIT JEANS.png",
    name: "Skinny Fit Jeans",
    rating: 3.5,
    priceCent: 240,
    oldPrice: 260,
    discount: 20,
  },
  {
    img: "./images/main-page-img/CHECKERED SHIRT.png",
    name: "CHECKERED SHIRT",
    rating: 4.5,
    priceCent: 180,
  },
  {
    img: "./images/main-page-img/SLEEVE STRIPED T-SHIRT.png",
    name: "SLEEVE STRIPED T-SHIRT",
    rating: 4.5,
    priceCent: 130,
    oldPrice: 160,
    discount: 30,
  },
];

const costumers = [
  {
    name: "Sarah M.",
    coment: `"I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.”`,
  },
  {
    name: "Alex K.",
    coment: `"Finding clothes that align with my personal style was hard
                until I discovered Shop.co. The range of options is truly
                remarkable."`,
  },
  {
    name: "James L.",
    coment: `"As someone who's always on the lookout for unique fashion
                pieces, I'm thrilled to have stumbled upon Shop.co."`,
  },
  {
    name: "Sarah M.",
    coment: `"I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.”`,
  },
  {
    name: "Alex K.",
    coment: `"Finding clothes that align with my personal style was hard
                until I discovered Shop.co. The range of options is truly
                remarkable."`,
  },
  {
    name: "James L.",
    coment: `"As someone who's always on the lookout for unique fashion
                pieces, I'm thrilled to have stumbled upon Shop.co."`,
  },
  {
    name: "James L.",
    coment: `"As someone who's always on the lookout for unique fashion
                pieces, I'm thrilled to have stumbled upon Shop.co."`,
  },
];
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


let productHtml = ``;
products.forEach((product) => {
  const ratingImage = `./images/rating-${
    Math.round(product.rating * 2) * 5
  }.png`;

  productHtml += `
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
