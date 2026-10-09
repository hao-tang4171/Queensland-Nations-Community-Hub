/*
----------------------------------------
FILE: content.js
PAGE: content.html
PURPOSE: posts API
----------------------------------------
*/

import { API_HEADERS } from "../modules/apiHeaders.js";
import { renderContent } from "../modules/renderContent.js";

/* =========================
   CONSTANTS
========================= */
const statusEl = document.querySelector("#status");
const container = document.querySelector("#content-list");
const filterBar = document.querySelector("#filter-bar");


let allResults = [];

/* =========================
   FUNCTIONS
========================= */


function filterContent(type) {
  if (type === "all") {
    renderContent(allResults);
  } else {
    const filtered = allResults.filter(item => item.content_type === type);

    if (filtered.length === 0) {
      container.innerHTML = "";
      statusEl.textContent = "No content found for this category.";
    } else {
      statusEl.textContent = "";
      renderContent(filtered);
    }
  }
}


function handleFilterClick(event) {
  const btn = event.target.closest(".filter-btn");
  if (!btn) return;


  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.remove("filter-btn--active");
  });
  btn.classList.add("filter-btn--active");


  const type = btn.dataset.filter;
  filterContent(type);
}


function fetchContent() {
  statusEl.textContent = "Loading content...";
  container.innerHTML = "";

  const url = "https://deco7140-api.uqcloud.net/api/posts/";

  fetch(url, {
    method: "GET",
    headers: API_HEADERS
  })
    .then(response => response.json())
    .then(data => {
      if (!data || data.length === 0) {
        statusEl.textContent = "No content available.";
        return;
      }

      
      allResults = data;
      statusEl.textContent = "";
      renderContent(allResults);
    })
    .catch(error => {
      statusEl.textContent = "Failed to load content. Please try again.";
      container.innerHTML = "";
      console.error("Fetch error:", error);
    });
}

/* =========================
   EVENT LISTENERS
========================= */
filterBar.addEventListener("click", handleFilterClick);

/* =========================
   INIT
========================= */
fetchContent();