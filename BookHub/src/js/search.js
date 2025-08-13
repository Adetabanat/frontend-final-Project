import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  setupSearchHandler,
} from "./utils.mjs";
import { searchBooks } from "./api.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  renderSearchResults();
  setupSearchHandler;
});

async function renderSearchResults() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const container = document.getElementById("search-results");

  if (!query) {
    container.innerHTML = "<p>No search query provided.</p>";
    return;
  }

  container.innerHTML = `<p>Searching for "${query}"...</p>`;

  try {
    const books = await searchBooks(query, 12);

    if (!books || books.length === 0) {
      container.innerHTML = `<p>No results found for "${query}".</p>`;
      return;
    }

    container.innerHTML = books
      .map((book) => {
        const bookId = book.id;
        const title = book.volumeInfo.title || "No Title";
        const authors = book.volumeInfo.authors?.join(", ") || "Unknown";
        const thumbnail =
          book.volumeInfo.imageLinks?.thumbnail ||
          "https://via.placeholder.com/128x195";

        return `
          <div class="book-card">
            <a href="/book-detail/book-detail.html?id=${bookId}">
              <img src="${thumbnail}" alt="${title}">
              <h4>${title}</h4>
              <p>${authors}</p>
            </a>
            <button class="add-favorite" 
                    data-id="${bookId}" 
                    data-title="${title}" 
                    data-author="${authors}" 
                    data-image="${thumbnail}">
              ❤️ Add to Favorites
            </button>
            <button class="add-cart" 
                    data-id="${bookId}" 
                    data-title="${title}" 
                    data-author="${authors}" 
                    data-image="${thumbnail}">
              🛒 Add to Cart
            </button>
          </div>
        `;
      })
      .join("");

    // Add Favorites functionality
    container.querySelectorAll(".add-favorite").forEach((btn) => {
      btn.addEventListener("click", () => {
        const favorites = getLocalStorage("favorites");
        const id = btn.dataset.id;
        if (!favorites.some((f) => f.id === id)) {
          favorites.push({
            id,
            title: btn.dataset.title,
            author: btn.dataset.author,
            image: btn.dataset.image,
          });
          setLocalStorage("favorites", favorites);
          alert("Book added to favorites!");
        } else {
          alert("Book already in favorites.");
        }
      });
    });

    // Add to Cart functionality
    container.querySelectorAll(".add-cart").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cart = getLocalStorage("cart");
        const id = btn.dataset.id;
        const existing = cart.find((c) => c.id === id);
        if (existing) {
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          cart.push({
            id,
            title: btn.dataset.title,
            author: btn.dataset.author,
            image: btn.dataset.image,
            quantity: 1,
          });
        }
        setLocalStorage("cart", cart);
        alert("Book added to cart!");
      });
    });
  } catch (err) {
    container.innerHTML = `<p>Error fetching results. Try again.</p>`;
    console.error(err);
  }
}
