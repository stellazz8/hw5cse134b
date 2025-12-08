
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


const LOCAL_STORAGE_KEY = "stella-projects-local";

const defaultLocalProjects = [
  {
    title: "CSE 134B Music Portfolio",
    image: "IMG_9530.jpg",
    imageAlt: "Cover-style artwork used on my music portfolio site",
    description:
      "A responsive music portfolio site built with semantic HTML, CSS grid/flexbox, view transitions, and a localStorage-backed theme toggle.",
    link: "index.html",
    linkText: "Visit the portfolio homepage",
    date: "2025",
    tags: "Web Design · Front-end · Accessibility"
  },
  {
    title: "HPHS Christmas Concert",
    image: "IMG_6042.JPG",
    imageAlt: "Stella performing violin at the HPHS Christmas concert",
    description:
      "Live orchestral performance focusing on dynamic phrasing, ensemble balance, and expressive violin tone.",
    link: "music.html",
    linkText: "Listen to recordings",
    date: "2023",
    tags: "Violin · Orchestra · Live Recording"
  },
  {
    title: "Chicago – Vocal Performance",
    image: "IMG_4409.JPG",
    imageAlt: "Stella singing live in the school show Chicago",
    description:
      "Vocal feature in the school production of Chicago, working on character interpretation, breath support, and stage presence.",
    link: "gallery.html",
    linkText: "View performance photos",
    date: "2024",
    tags: "Vocals · Musical Theatre"
  },
  {
    title: "Contact & Feedback System",
    image: "IMG_9530.jpg",
    imageAlt: "Stylized UI representing a contact form and validation",
    description:
      "Progressively enhanced contact form with HTML validation, custom JavaScript error handling, and server-side POST via httpbin.",
    link: "form-with-js.html",
    linkText: "Try the interactive form",
    date: "2025",
    tags: "Forms · JavaScript · UX"
  }
];

const REMOTE_URL =
  "https://api.jsonbin.io/v3/b/6935f911d0ea881f40196747";

function saveLocalProjectsIfMissing() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultLocalProjects));
  }
}

function loadLocalProjects() {
  saveLocalProjectsIfMissing();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error parsing local projects JSON:", e);
    return [];
  }
}

function renderCards(projects, container) {
  container.innerHTML = "";

  projects.forEach((p) => {
    const card = document.createElement("project-card");

    if (p.title) card.setAttribute("title", p.title);
    if (p.image) card.setAttribute("image", p.image);
    if (p.imageAlt || p.image_alt) {
      card.setAttribute("image-alt", p.imageAlt || p.image_alt);
    }
    if (p.description) card.setAttribute("description", p.description);
    if (p.link) card.setAttribute("link", p.link);

    const linkText = p.linkText || p.link_text || "Learn more";
    card.setAttribute("link-text", linkText);

    if (p.date) card.setAttribute("date", p.date);
    if (p.tags) card.setAttribute("tags", p.tags);

    container.appendChild(card);
  });
}

async function fetchRemoteProjects() {
  const res = await fetch(REMOTE_URL);
  if (!res.ok) {
    throw new Error(`Network error: ${res.status}`);
  }
  const data = await res.json();

  if (Array.isArray(data)) {
    return data;
  } else if (Array.isArray(data.projects)) {
    return data.projects;
  } else if (Array.isArray(data.record)) {
    return data.record;
  }
  return [];
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".project-grid");
  const loadLocalBtn = document.querySelector("#load-local");
  const loadRemoteBtn = document.querySelector("#load-remote");

  if (!grid || !loadLocalBtn || !loadRemoteBtn) return;

  loadLocalBtn.addEventListener("click", () => {
    const projects = loadLocalProjects();
    renderCards(projects, grid);
  });

  loadRemoteBtn.addEventListener("click", async () => {
    try {
      const projects = await fetchRemoteProjects();
      renderCards(projects, grid);
    } catch (err) {
      console.error(err);
      alert("Sorry, I couldn't load the remote project data yet.");
    }
  });
});
