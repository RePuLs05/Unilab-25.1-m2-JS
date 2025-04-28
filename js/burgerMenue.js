// Burger Menu Functionality
function openMenu() {
  document.getElementById("sideMenu").classList.add("open");
}

function closeMenu() {
  document.getElementById("sideMenu").classList.remove("open");
}

function toggleDropdown() {
  const dropdown = document.getElementById("dropdownMenu");
  const toggle = document.querySelector(".dropdown-toggle");
  dropdown.classList.toggle("open");
  toggle.classList.toggle("open");
}
