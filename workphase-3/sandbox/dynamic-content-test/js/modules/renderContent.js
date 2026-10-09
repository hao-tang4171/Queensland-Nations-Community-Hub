export function renderContent(items) {
  const container = document.querySelector("#content-list");

  const html = items.map((item) => {
    return `
      <article class="content-card">
        <h3 class="content-card__title">${item.title}</h3>
        <p class="content-card__body">${item.content}</p>
        <p class="content-card__body">${item.content_type}</p>
        <p class="content-card__body">${item.author}</p>
      </article>
    `;
  }).join("");

  container.innerHTML = html;
}