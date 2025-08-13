// src/js/api.mjs

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";

// Fetch books by query
export async function searchBooks(query, maxResults = 5) {
  try {
    const url = `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch books");
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("Google Books API Error:", err);
    return [];
  }
}

// Fetch a single book by ID
export async function fetchBookById(id) {
  try {
    const res = await fetch(`${GOOGLE_BOOKS_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch book details");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Book Details API Error:", err);
    return null;
  }
}

// Fetch a random quote
export const QUOTABLE_URL = "https://api.quotable.io/random";
export async function fetchRandomQuote() {
  try {
    const res = await fetch(QUOTABLE_URL);
    if (!res.ok) throw new Error("Failed to fetch quote");
    return await res.json();
  } catch (err) {
    console.error("Quote API Error:", err);
    return {
      content: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    };
  }
}

// Fetch books from Gutendex API
export async function fetchGutendexBooks(query = "", limit = 5) {
  try {
    const url = `https://gutendex.com/books/?search=${encodeURIComponent(query)}&page=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gutendex API error");
    const data = await res.json();

    // Limit the number of books returned
    return data.results.slice(0, limit).map((book) => ({
      id: book.id,
      title: book.title,
      authors: book.authors.map((a) => a.name).join(", ") || "Unknown",
      image:
        book.formats["image/jpeg"] || "https://via.placeholder.com/128x195",
    }));
  } catch (err) {
    console.error("Gutendex API Error:", err);
    return [];
  }
}

// Fetch a single Gutendex book by ID
export async function fetchGutendexBookById(id) {
  try {
    const url = `https://gutendex.com/books/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gutendex API error");
    const book = await res.json();

    return {
      id: book.id,
      title: book.title,
      authors: book.authors.map((a) => a.name).join(", ") || "Unknown",
      image:
        book.formats["image/jpeg"] || "https://via.placeholder.com/128x195",
      download:
        book.formats["text/plain; charset=utf-8"] ||
        book.formats["application/epub+zip"] ||
        null,
      subjects: book.subjects.join(", "),
    };
  } catch (err) {
    console.error("Gutendex Book Fetch Error:", err);
    return null;
  }
}
