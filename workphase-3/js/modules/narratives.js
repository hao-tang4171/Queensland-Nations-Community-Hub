
/**
 * @param {string} url 
 * @returns {Promise<Array>} 
 */
export async function fetchNarratives(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
   
    return Array.isArray(data.narratives) ? data.narratives : [];
}

/**
 
 * @param {string} value
 * @returns {string}
 */
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
 
 * @param {Object} item 
 * @returns {string} 
 */
function renderNarrativeCard(item) {
    const title = escapeHtml(item.title);
    const author = escapeHtml(item.author);
    const content = escapeHtml(item.content);
    const note = escapeHtml(item.note);

    
    const imageHtml = item.image_url
        ? `<img class="narrative-card__image" src="${escapeHtml(item.image_url)}"
                alt="${escapeHtml(item.image_alt || "")}" loading="lazy">`
        : "";

    
    const audioHtml = item.audio_url
        ? `<audio class="narrative-card__audio" controls preload="none">
               <source src="${escapeHtml(item.audio_url)}" type="audio/mp4">
               Your browser does not support the audio element.
           </audio>`
        : "";

    const noteHtml = note
        ? `<p class="narrative-card__note">${note}</p>`
        : "";

    return `
        <article class="card narrative-card">
            ${imageHtml}
            <p class="narrative-card__author">${author}</p>
            <h2 class="narrative-card__title">${title}</h2>
            <p class="narrative-card__content">${content}</p>
            ${audioHtml}
            ${noteHtml}
        </article>
    `;
}

/**

 * @param {HTMLElement} container
 * @param {Array} narratives
 */
export function renderNarratives(container, narratives) {
    container.innerHTML = narratives.map(renderNarrativeCard).join("");
}

/** loading */
export function renderLoading(container) {
    container.innerHTML = `
        <div class="narrative-status" role="status" aria-live="polite">
            <p>Loading narratives…</p>
            <div class="narrative-skeleton"></div>
            <div class="narrative-skeleton"></div>
            <div class="narrative-skeleton"></div>
        </div>
    `;
}

/** empty */
export function renderEmpty(container) {
    container.innerHTML = `
        <div class="narrative-status">
            <h2>The archive is still growing</h2>
            <p>No narratives have been added yet. Please check back soon.</p>
        </div>
    `;
}

/** error */
export function renderError(container, message) {
    container.innerHTML = `
        <div class="narrative-status narrative-status--error" role="alert">
            <h2>We couldn't load the narratives</h2>
            <p>${escapeHtml(message || "Please try again later.")}</p>
        </div>
    `;
}