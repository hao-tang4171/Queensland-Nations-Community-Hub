import { fetchPosts, renderPosts, renderLoading, renderEmpty, renderError } from "../modules/posts.js";

const POSTS_URL = "https://deco7140-api.uqcloud.net/api/posts/";

const API_HEADERS = {
   "X-Student-Number": "s4945076",
  "X-API-Token": "Banana-Wallaby-21"
};

/* =========================
   INIT
========================= */
async function initPosts() {
  const container = document.querySelector("#posts-container");
  if (!container) return;

  renderLoading(container);

  try {
    const posts = await fetchPosts(POSTS_URL, API_HEADERS);
    if (posts.length === 0) {
      renderEmpty(container);
    } else {
      renderPosts(container, posts);
    }
  } catch (error) {
    renderError(container, error.message);
    console.error(error);
  }
}

initPosts();