const AdminUI = (() => {
  const modal = document.querySelector(".js-modal");
  const modalContent = document.querySelector(".js-modal-content");
  const toastContainer = document.querySelector(".js-toast-container");

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  function openModal(html) {
    modalContent.innerHTML = html;
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modalContent.innerHTML = "";
  }

  function confirmAction(message, onConfirm) {
    openModal(`
      <h3>Confirm Action</h3>
      <p>${message}</p>
      <div class="inline-actions">
        <button class="btn danger js-confirm-btn">Confirm</button>
        <button class="btn secondary js-cancel-btn">Cancel</button>
      </div>
    `);

    document.querySelector(".js-confirm-btn").addEventListener("click", () => {
      onConfirm();
      closeModal();
    });
    document.querySelector(".js-cancel-btn").addEventListener("click", closeModal);
  }

  modal?.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-modal-close")) {
      closeModal();
    }
  });

  return { showToast, openModal, closeModal, confirmAction };
})();
