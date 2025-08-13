import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  setupSearchHandler,
} from "./utils.mjs";
import { fetchRandomQuote, searchBooks } from "./api.mjs";
import { fetchGutendexBooks } from "./api.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  setupSearchHandler();

  // Update header counts
  updateHeaderCounts();

  // Render scrolling quote
  const quote = await fetchRandomQuote();
  const quoteContainer = document.getElementById("quote-container");
  quoteContainer.innerHTML = `<span class="scrolling-quote">"${quote.content}" - ${quote.author}</span>`;

  // Render book sections
  await renderBooksSection("recommended-books", "bestsellers");
  await renderBooksSection("trending-books", "technology");
  await renderFavoritesSection("favorite-books");

  // Render Gutendex Free eBooks
  await renderGutendexSection("gutendex-books", "fiction");
});

// Update favorites count in header
function updateHeaderCounts() {
  const favoritesCountEl = document.querySelector(".favorites-count");
  const cartCountEl = document.getElementById("cart-count");
  if (favoritesCountEl)
    favoritesCountEl.textContent = getLocalStorage("favorites").length;
  if (cartCountEl) cartCountEl.textContent = getLocalStorage("cart").length;
}

// Render books by query with Add to Favorites button
async function renderBooksSection(containerId, query) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const books = await searchBooks(query, 8);
  container.innerHTML = books
    .map((book) => {
      const bookId = book.id;
      const title = book.volumeInfo.title || "No Title";
      const authors = book.volumeInfo.authors
        ? book.volumeInfo.authors.join(", ")
        : "Unknown";
      const thumbnail =
        book.volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/128x195";

      return `
        <div class="book-card">
          <a href="/book_pages/book-details.html?id=${bookId}">
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
        </div>
      `;
    })
    .join("");

  // Add click events for Add to Favorites buttons
  container.querySelectorAll(".add-favorite").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // prevent link click
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
        updateHeaderCounts();
        renderFavoritesSection("favorite-books"); // refresh favorites section
      } else {
        alert("Book already in favorites.");
      }
    });
  });
}

// Render favorites from localStorage
function renderFavoritesSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const favorites = getLocalStorage("favorites");
  if (favorites.length === 0) {
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
          <a href="/book-detail/book-details.html?id=${book.id}">
            <img src="${thumbnail}" alt="${title}">
            <h4>${title}</h4>
            <p>${author}</p>
          </a>
        </div>
      `;
    })
    .join("");
}

// Render Gutendex books
async function renderGutendexSection(containerId, query) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const books = await fetchGutendexBooks(query, 8);
  console.log(books);
  if (!books || books.length === 0) {
    container.innerHTML = "<p>No free eBooks found.</p>";
    return;
  }

  container.innerHTML = books
    .map(
      (book) => `
      <div class="book-card">
         <a href="/book_pages/book-details.html?id=${book.id}">
          <img src="${book.image}" alt="${book.title}">
          <h4>${book.title}</h4>
          <p>${book.authors}</p>
        </a>
        <button class="add-favorite" 
                data-id="${book.id}" 
                data-title="${book.title}" 
                data-author="${book.authors}" 
                data-image="${book.image}">
          ❤️ Add to Favorites
        </button>
      </div>
    `,
    )
    .join("");

  // Add Favorites functionality
  container.querySelectorAll(".add-favorite").forEach((btn) => {
    btn.addEventListener("click", () => {
      const favorites = getLocalStorage("favorites");
      const id = btn.dataset.id;
      if (!favorites.some((f) => f.id == id)) {
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
}
