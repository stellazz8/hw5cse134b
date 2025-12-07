class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const title = this.getAttribute("title") || "Untitled Project";
    const image = this.getAttribute("image") || "";
    const imageAlt = this.getAttribute("image-alt") || "";
    const description =
      this.getAttribute("description") ||
      "No description provided yet.";
    const link = this.getAttribute("link") || "#";
    const linkText = this.getAttribute("link-text") || "Learn more";
    const date = this.getAttribute("date") || "";
    const tags = this.getAttribute("tags") || "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        article {
          background: var(--card-bg, #f7f7f7);
          border-radius: 1rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          height: 100%;
        }

        h2 {
          font-size: 1.25rem;
          margin: 0;
          color: var(--heading-color, #222);
        }

        picture {
          display: block;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        .meta {
          font-size: 0.85rem;
          color: #777;
        }

        .description {
          font-size: 0.95rem;
          color: var(--text-color, #555);
          line-height: 1.5;
        }

        .tags {
          font-size: 0.85rem;
          color: #555;
        }

        a {
          margin-top: auto;
          align-self: flex-start;
          text-decoration: none;
          font-weight: 600;
          color: var(--accent-color, #e67e22);
        }

        a:hover,
        a:focus-visible {
          text-decoration: underline;
        }
      </style>

      <article>
        <h2>${title}</h2>

        <picture>
          <img src="${image}" alt="${imageAlt}">
        </picture>

        ${date || tags
          ? `<p class="meta">${date}${date && tags ? " · " : ""}${tags}</p>`
          : ""}

        <p class="description">${description}</p>

        <a href="${link}">${linkText}</a>
      </article>
    `;
  }
}

customElements.define("project-card", ProjectCard);
