let reviewHtml = ``;

function createReviewHtml() {
  return  `
      <div class="modal-header">
      <h2>Write a Review</h2>
      <button class="close-modal">&times;</button>
    </div>
    <form id="reviewForm">
      <div class="form-group">
        <label for="name">Name</label>
        <div class="input-container">
          <div class="input-icon">
            <img src="./images/person_icon.png" alt="User icon" class="user-icon">
          </div>
          <input type="text" id="name" placeholder="Enter your name" required>
        </div>
      </div>
      
      <div class="form-group">
        <label for="email">Country/City</label>
        <div class="input-container">
          <div class="input-icon">
            <img src="./images/maill.png" alt="Email icon" class="email-icon">
          </div>
          <input type="email" id="email" placeholder="Enter your country/city" required>
        </div>
      </div>
      
      <div class="form-group">
        <label>Share your experience in scaling</label>
        <div class="star-rating">
          <span class="star" data-rating="1">★</span>
          <span class="star" data-rating="2">★</span>
          <span class="star" data-rating="3">★</span>
          <span class="star" data-rating="4">★</span>
          <span class="star" data-rating="5">★</span>
        </div>
        <input type="hidden" id="rating" value="0">
      </div>
      
      <div class="form-group">
        <textarea id="reviewText" placeholder="Add your comments..." required></textarea>
      </div>
      
      <div class="form-buttons">
        <button type="button" class="cancel-btn">Cancel</button>
        <button type="submit" class="submit-btn">SUBMIT</button>
      </div>
    </form>
  `;
}

// Call the function to generate the HTML
reviewHtml=createReviewHtml();

// Insert the HTML into the modal content
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".js-modal-content").forEach((container) => {
    container.innerHTML = reviewHtml;
  });

  const writeReviewBtn = document.querySelector(".write-review");
  const modal = document.getElementById("reviewModal");
  const closeModal = document.querySelector(".close-modal");
  const cancelBtn = document.querySelector(".cancel-btn");
  const form = document.getElementById("reviewForm");
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("rating");

  // Open modal
  if (writeReviewBtn) {
    writeReviewBtn.addEventListener("click", function () {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent scrolling
    });
  }

  // Close modal functions
  function closeReviewModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
    form.reset();
    resetStars();
  }

  // Close on X button click
  if (closeModal) {
    closeModal.addEventListener("click", closeReviewModal);
  }

  // Close on Cancel button click
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeReviewModal);
  }

  // Close on clicking outside the modal
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeReviewModal();
      }
    });
  }

  // Star rating functionality
  stars.forEach((star) => {
    // Hover effects
    star.addEventListener("mouseover", function () {
      const rating = this.getAttribute("data-rating");
      highlightStars(rating);
    });

    star.addEventListener("mouseout", function () {
      const currentRating = ratingInput.value;
      resetStars();
      if (currentRating > 0) {
        highlightStars(currentRating);
      }
    });

    // Click to set rating
    star.addEventListener("click", function () {
      const rating = this.getAttribute("data-rating");
      ratingInput.value = rating;
      highlightStars(rating);
    });
  });

  function highlightStars(rating) {
    stars.forEach((star) => {
      const starRating = star.getAttribute("data-rating");
      if (starRating <= rating) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  }

  function resetStars() {
    stars.forEach((star) => {
      star.classList.remove("active");
    });
    ratingInput.value = 0;
  }
});
