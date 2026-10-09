
const CONTENT_TYPE_LABELS = {
  event: "Event",
  photo: "Photo",
  blog: "Blog",
  story: "Story",
  other: "Other"
};

/**

 * @param {string} url
 * @returns {Promise<Array>}
 */
export async function fetchPosts(url, headers = {}) {
  const response = await fetch(url, { method: "GET", headers });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.posts)) return data.posts;
  return [];
}


function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


function renderPostCard(post) {
  const title = escapeHtml(post.title);
  const content = escapeHtml(post.content);
  const typeKey = (post.content_type || "").toLowerCase();
  const typeLabel = CONTENT_TYPE_LABELS[typeKey] || "Other";

  // image
  const imageSrc = post.image_url || post.image || post.uploaded_image || "";
  const imageHtml = imageSrc
    ? `<img class="post-card__image" src="${escapeHtml(imageSrc)}" alt="${title}" loading="lazy">`
    : "";

  // event 
  const dateHtml = (typeKey === "event" && post.event_date)
    ? `<p class="post-card__date">${escapeHtml(post.event_date)}</p>`
    : "";

  return `
    <article class="card post-card">
      ${imageHtml}
      <span class="post-card__type">${typeLabel}</span>
      <h2 class="post-card__title">${title}</h2>
      ${dateHtml}
      <p class="post-card__content">${content}</p>
    </article>
  `;
}


export function renderPosts(container, posts) {
  container.innerHTML = posts.map(renderPostCard).join("");
}

/** loading  */
export function renderLoading(container) {
  container.innerHTML = `
    <div class="post-status" role="status" aria-live="polite">
      <p>Loading community posts…</p>
    </div>`;
}

/** empty */
export function renderEmpty(container) {
  container.innerHTML = `
    <div class="post-status">
      <h2>No posts yet</h2>
      <p>No one has shared anything yet. Be the first to contribute on the Submit page.</p>
    </div>`;
}

/** error */
export function renderError(container, message) {
  container.innerHTML = `
    <div class="post-status post-status--error" role="alert">
      <h2>We couldn't load the posts</h2>
      <p>${escapeHtml(message || "Please try again later.")}</p>
    </div>`;
}