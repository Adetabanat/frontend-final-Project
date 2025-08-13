import { loadHeaderFooter, setupSearchHandler } from "./utils.mjs";
import { searchBooks } from "./api.mjs";

const categories = [
  "Fiction",
  "Non-fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Children",
  "Mystery",
  "Romance",
];

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  renderCategories();
  setupSearchHandler();
});

// Render category buttons
function renderCategories() {
  const container = document.getElementById("category-list");
  container.innerHTML = categories
    .map(
      (cat) =>
        `<button class="category-btn" data-category="${cat}">${cat}</button>`,
    )
    .join("");

  container.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const category = btn.dataset.category;
      document.getElementById("category-title").textContent =
        `Books in "${category}"`;
      await renderBooksByCategory(category);
    });
  });
}

// Render books for selected category
async function renderBooksByCategory(category) {
  const container = document.getElementById("category-books");
  const books = await searchBooks(category, 12);

  if (!books || books.length === 0) {
    container.innerHTML = "<p>No books found in this category.</p>";
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
        </div>
      `;
    })
    .join("");
}
