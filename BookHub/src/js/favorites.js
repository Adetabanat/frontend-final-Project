import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  setupSearchHandler,
} from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  renderFavorites();
  setupSearchHandler();
});

// Render favorite books
function renderFavorites() {
  const container = document.getElementById("favorites-container");
  const favorites = getLocalStorage("favorites");

  if (!favorites || favorites.length === 0) {
    container.innerHTML = "<p>No favorite books yet.</p>";
    return;
  }

  container.innerHTML = favorites
    .map((book) => {
      const title = book.title || "No Title";
      const author = book.author || "Unknown";
      const thumbnail = book.image || "https://via.placeholder.com/128x195";

      return `
        <div class="book-card">
          <a href="/book-detail/book-detail.html?id=${book.id}">
            <img src="${thumbnail}" alt="${title}">
            <h4>${title}</h4>
            <p>${author}</p>
          </a>
          <button class="remove-favorite" data-id="${book.id}">Remove ❤️</button>
        </div>
      `;
    })
    .join("");

  // Add click events to remove buttons
  container.querySelectorAll(".remove-favorite").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const updatedFavorites = favorites.filter((f) => f.id !== id);
      setLocalStorage("favorites", updatedFavorites);
      renderFavorites(); // re-render after removal
      updateHeaderCount();
    });
  });
}

// Update favorites count in header
function updateHeaderCount() {
  const countEl = document.querySelector(".favorites-count");
  if (countEl) countEl.textContent = getLocalStorage("favorites").length;
}
