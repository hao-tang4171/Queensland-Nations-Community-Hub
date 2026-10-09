
import { API_HEADERS } from "./js/modules/apiHeaders.js";
import { renderContent } from "./js/modules/renderContent.js";

/* =========================
   CONSTANTS
========================= */
const statusEl = document.querySelector("#status");
const container = document.querySelector("#content-list");

/* =========================
   FUNCTIONS
========================= */
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

     
      console.log("API ：", data);
      console.log("first data", data[0]);

      if (!data || data.length === 0) {
        statusEl.textContent = "No content available.";
        return;
      }

      statusEl.textContent = "";
      renderContent(data);
    })
    .catch(error => {
      statusEl.textContent = "Failed to load content. Please try again.";
      container.innerHTML = "";
      console.error("Fetch error:", error);
    });
}

/* =========================
   INIT
========================= */
fetchContent();