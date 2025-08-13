// src/js/utils.mjs
export const qs = (selector) => document.querySelector(selector);

export async function loadHeaderFooter() {
  try {
    const headerContainer = qs("header");
    if (headerContainer) {
      const resHeader = await fetch("/public/partials/header.html");
      if (!resHeader.ok) throw new Error("Header fetch failed");
      headerContainer.innerHTML = await resHeader.text();
    }

    const footerContainer = qs("footer");
    if (footerContainer) {
      const resFooter = await fetch("/public/partials/footer.html");
      if (!resFooter.ok) throw new Error("Footer fetch failed");
      footerContainer.innerHTML = await resFooter.text();
    }
  } catch (err) {
    console.error("Error loading header/footer:", err);
  }
}

// LocalStorage helpers
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function setupSearchHandler() {
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = document.getElementById("search-input").value.trim();
      if (!query) return;
      window.location.href = `/search/search.html?q=${encodeURIComponent(query)}`;
    });
  }
}
