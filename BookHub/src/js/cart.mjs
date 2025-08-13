import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  setupSearchHandler,
} from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  renderCart();
  setupSearchHandler();
});

// Render cart items with quantity
function renderCart() {
  const container = document.getElementById("cart-container");
  const cart = getLocalStorage("cart");

  if (!cart || cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    updateCartCount();
    return;
  }

  container.innerHTML = cart
    .map((book) => {
      const title = book.title || "No Title";
      const author = book.author || "Unknown";
      const thumbnail = book.image || "https://via.placeholder.com/128x195";
      const quantity = book.quantity || 1;

      return `
        <div class="book-card">
          <a href="/book-detail/book-detail.html?id=${book.id}">
            <img src="${thumbnail}" alt="${title}">
            <h4>${title}</h4>
            <p>${author}</p>
          </a>
          <div class="cart-controls">
            <button class="decrease-qty" data-id="${book.id}">-</button>
            <span class="qty">${quantity}</span>
            <button class="increase-qty" data-id="${book.id}">+</button>
          </div>
          <button class="remove-cart" data-id="${book.id}">Remove 🛒</button>
        </div>
      `;
    })
    .join("");

  // Add remove functionality
  container.querySelectorAll(".remove-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const updatedCart = cart.filter((c) => c.id !== id);
      setLocalStorage("cart", updatedCart);
      renderCart();
      updateCartCount();
    });
  });

  // Increase quantity
  container.querySelectorAll(".increase-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const updatedCart = cart.map((item) => {
        if (item.id === id) item.quantity = (item.quantity || 1) + 1;
        return item;
      });
      setLocalStorage("cart", updatedCart);
      renderCart();
      updateCartCount();
      setupSearchHandler();
    });
  });

  // Decrease quantity
  container.querySelectorAll(".decrease-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const updatedCart = cart.map((item) => {
        if (item.id === id)
          item.quantity = Math.max((item.quantity || 1) - 1, 1);
        return item;
      });
      setLocalStorage("cart", updatedCart);
      renderCart();
      updateCartCount();
    });
  });

  updateCartCount();
}

// Update cart count in header (total items)
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  const cart = getLocalStorage("cart");
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  if (countEl) countEl.textContent = totalItems;
}
