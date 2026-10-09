

/**
 * @param {string} url
 * @returns {Promise<Array>}
 */
export async function fetchNarrativePreviews(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.narratives) ? data.narratives : [];
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

/**
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(text, maxLength = 110) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "…";
}

/**
 
 * @param {Object} item
 * @returns {string}
 */
function renderPreviewCard(item) {
    const title = escapeHtml(item.title);
    const excerpt = escapeHtml(truncate(item.content));

    const imageHtml = item.image_url
        ? `<img class="preview-card__image" src="${escapeHtml(item.image_url)}"
                alt="${escapeHtml(item.image_alt || "")}" loading="lazy">`
        : "";

    return `
        <a class="card card--interactive preview-card" href="extension.html">
            ${imageHtml}
            <h3 class="preview-card__title">${title}</h3>
            <p class="preview-card__excerpt">${excerpt}</p>
            <span class="preview-card__more">Listen to this story →</span>
        </a>
    `;
}

/**

 * @param {HTMLElement} container
 * @param {Array} narratives
 * @param {number} count
 */
export function renderPreviews(container, narratives, count = 3) {
    const subset = narratives.slice(0, count);
    container.innerHTML = subset.map(renderPreviewCard).join("");
}

export function renderPreviewError(container) {
    container.innerHTML = `
        <p class="preview-status" role="alert">
            Stories couldn't be loaded right now. Please visit the
            <a href="extension.html">Stories page</a> directly.
        </p>
    `;
}