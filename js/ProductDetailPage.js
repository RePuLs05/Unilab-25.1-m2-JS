const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

// Find the product with the matching ID
const product = products.find((p) => p.id === productId);
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

  // Add event listener to the Add to Cart button
  const addToCartButton = document.querySelector(".add-to-cart");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      const quantity = parseInt(document.querySelector(".actions").value);
      console.log(`Added ${quantity} of ${product.name} to cart`);
      // Here you would add the logic to actually add the item to the cart
      alert(`Added ${quantity} of ${product.name} to cart!`);
    });
  }

  // Add event listeners to the size buttons
  const sizeButtons = document.querySelectorAll(".size-options button");
  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove the active class from all buttons
      sizeButtons.forEach((btn) => btn.classList.remove("active"));
      // Add the active class to the clicked button
      button.classList.add("active");
    });
  });

  // Add event listeners to the color options
  const colorOptions = document.querySelectorAll(
    ".color-options .color-circle"
  );
  colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      colorOptions.forEach((opt) => opt.classList.remove("active"));

      option.classList.add("active");
    });
  });
} else {
  document.querySelector(".hero-category-info").innerHTML =
    "<h2>Product not found</h2>";
}

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





// Review Modal JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  const writeReviewBtn = document.querySelector('.write-review');
  const modal = document.getElementById('reviewModal');
  const closeModal = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.cancel-btn');
  const form = document.getElementById('reviewForm');
  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('rating');
  
  // Open modal
  writeReviewBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  });
  
  // Close modal functions
  function closeReviewModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    form.reset();
    resetStars();
  }
  
  // Close on X button click
  closeModal.addEventListener('click', closeReviewModal);
  
  // Close on Cancel button click
  cancelBtn.addEventListener('click', closeReviewModal);
  
  // Close on clicking outside the modal
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeReviewModal();
    }
  });
  
  // Star rating functionality
  stars.forEach(star => {
    // Hover effects
    star.addEventListener('mouseover', function() {
      const rating = this.getAttribute('data-rating');
      highlightStars(rating);
    });
    
    star.addEventListener('mouseout', function() {
      const currentRating = ratingInput.value;
      resetStars();
      if (currentRating > 0) {
        highlightStars(currentRating);
      }
    });
    
    // Click to set rating
    star.addEventListener('click', function() {
      const rating = this.getAttribute('data-rating');
      ratingInput.value = rating;
      highlightStars(rating);
    });
  });
  
  function highlightStars(rating) {
    stars.forEach(star => {
      const starRating = star.getAttribute('data-rating');
      if (starRating <= rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
  
  function resetStars() {
    stars.forEach(star => {
      star.classList.remove('active');
    });
    ratingInput.value = 0;
  }
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const rating = ratingInput.value;
    const reviewText = document.getElementById('reviewText').value;
    
    // Validate form
    if (!name || !email || rating === '0' || !reviewText) {
      alert('Please fill out all fields and select a rating.');
      return;
    }
    
    // Here you would typically send the data to a server
    console.log('Review submitted:', {
      name,
      email,
      rating,
      reviewText
    });
    
    // Add the review to the page (optional - demo purpose)
    addReviewToPage(name, rating, reviewText);
    
    // Close modal and reset form
    closeReviewModal();
  });
  
  // Optional: Function to add the review to the page
  function addReviewToPage(name, rating, text) {
    const reviewGrid = document.querySelector('.review-grid');
    
    const reviewCard = document.createElement('div');
    reviewCard.classList.add('review-card');
    
    const ratingHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    reviewCard.innerHTML = `
      <div class="review-header">
        <h4>${name}</h4>
        <div class="review-rating">${ratingHTML}</div>
      </div>
      <p class="review-text">${text}</p>
      <p class="date">Just now</p>
    `;
    
    reviewGrid.prepend(reviewCard);
  }
});