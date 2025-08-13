import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  setupSearchHandler,
} from "./utils.mjs";
import { fetchBookById } from "./api.mjs";
import { fetchGutendexBookById } from "./api.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  setupSearchHandler();

  const container = document.getElementById("book-detail-container");
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  if (!bookId) {
    container.innerHTML = "<p>Book not found. No ID provided.</p>";
    return;
  }

  let book;
  let isGutendex = false;

  // Determine if ID is numeric → treat as Gutendex eBook
  if (!isNaN(bookId)) {
    book = await fetchGutendexBookById(bookId);
    isGutendex = true;
  } else {
    book = await fetchBookById(bookId);
  }

  if (!book) {
    container.innerHTML = "<p>Failed to load book details.</p>";
    return;
  }

  // Prepare book details
  const title = isGutendex ? book.title : book.volumeInfo.title;
  const authors = isGutendex
    ? book.authors
    : book.volumeInfo.authors?.join(", ") || "Unknown";
  const image = isGutendex
    ? book.image
    : book.volumeInfo.imageLinks?.thumbnail ||
      "https://via.placeholder.com/200x300";
  const publisher = isGutendex
    ? "Public Domain"
    : book.volumeInfo.publisher || "Unknown";
  const publishedDate = isGutendex
    ? "N/A"
    : book.volumeInfo.publishedDate || "Unknown";
  const description = isGutendex
    ? `Subjects: ${book.subjects || "N/A"}`
    : book.volumeInfo.description || "No description available.";
  const downloadLink = isGutendex ? book.download : null;

  container.innerHTML = `
    <div class="book-detail-card">
      <img src="${image}" alt="${title}">
      <div class="book-detail-info">
        <h2>${title}</h2>
        <p><strong>Author:</strong> ${authors}</p>
        <p><strong>Publisher:</strong> ${publisher}</p>
        <p><strong>Published Date:</strong> ${publishedDate}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${downloadLink ? `<p><a href="${downloadLink}" target="_blank">📖 Download eBook</a></p>` : ""}
        <button id="add-favorite">Add to Favorites ❤️</button>
        <button id="add-cart">Add to Cart 🛒</button>
      </div>
    </div>
  `;

  // Add to Favorites
  document.getElementById("add-favorite").addEventListener("click", () => {
    const favorites = getLocalStorage("favorites");
    if (!favorites.some((f) => f.id == book.id)) {
      favorites.push({ id: book.id, title, author: authors, image });
      setLocalStorage("favorites", favorites);
      alert("Book added to favorites!");
    } else alert("Book already in favorites.");
  });

  // Add to Cart
  document.getElementById("add-cart").addEventListener("click", () => {
    const cart = getLocalStorage("cart");
    const existing = cart.find((f) => f.id == book.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ id: book.id, title, author: authors, image, quantity: 1 });
    }
    setLocalStorage("cart", cart);
    alert("Book added to cart!");
  });
});
