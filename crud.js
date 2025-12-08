const LOCAL_STORAGE_KEY = "stella-projects-local";

function getProjects() {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error parsing local projects:", e);
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

function showCrudInfo(message) {
  const info = document.querySelector("#crud-info");
  if (info) {
    info.textContent = message;
  }
}

function getNextId(projects) {
  if (projects.length === 0) return 1;
  const maxId = projects.reduce((max, p) => Math.max(max, p.id || 0), 0);
  return maxId + 1;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#crud-form");
  if (!form) return;

  const createBtn = document.querySelector("#create-btn");
  const updateBtn = document.querySelector("#update-btn");
  const deleteBtn = document.querySelector("#delete-btn");

  const idField = document.querySelector("#project-id");
  const titleField = document.querySelector("#project-title");
  const imageField = document.querySelector("#project-image");
  const imageAltField = document.querySelector("#project-image-alt");
  const descField = document.querySelector("#project-description");
  const linkField = document.querySelector("#project-link");
  const dateField = document.querySelector("#project-date");
  const tagsField = document.querySelector("#project-tags");

  if (createBtn) {
    createBtn.addEventListener("click", () => {
      if (!form.reportValidity()) return;

      const projects = getProjects();
      const newProject = {
        id: getNextId(projects),
        title: titleField.value.trim(),
        image: imageField.value.trim() || "IMG_9530.jpg",
        imageAlt: imageAltField.value.trim() || "Project cover artwork",
        description: descField.value.trim(),
        link: linkField.value.trim() || "index.html",
        date: dateField.value.trim() || "",
        tags: tagsField.value.trim() || ""
      };

      projects.push(newProject);
      saveProjects(projects);
      showCrudInfo(`Created project with ID ${newProject.id}. Reload "Load Local" on About page to see it.`);
      idField.value = newProject.id;
    });
  }

  if (updateBtn) {
    updateBtn.addEventListener("click", () => {
      const id = Number(idField.value);
      if (!id) {
        alert("Please enter a valid Project ID to update.");
        return;
      }
      if (!form.reportValidity()) return;

      const projects = getProjects();
      const idx = projects.findIndex((p) => p.id === id);
      if (idx === -1) {
        alert(`No project found with ID ${id}.`);
        return;
      }

      const updated = { ...projects[idx] };

      updated.title = titleField.value.trim();
      updated.image = imageField.value.trim() || updated.image;
      updated.imageAlt = imageAltField.value.trim() || updated.imageAlt;
      updated.description = descField.value.trim();
      updated.link = linkField.value.trim() || updated.link;
      updated.date = dateField.value.trim() || updated.date;
      updated.tags = tagsField.value.trim() || updated.tags;

      projects[idx] = updated;
      saveProjects(projects);
      showCrudInfo(`Updated project with ID ${id}. Reload "Load Local" on About page to see changes.`);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const id = Number(idField.value);
      if (!id) {
        alert("Please enter a valid Project ID to delete.");
        return;
      }

      const projects = getProjects();
      const beforeLength = projects.length;
      const remaining = projects.filter((p) => p.id !== id);

      if (remaining.length === beforeLength) {
        alert(`No project found with ID ${id}.`);
        return;
      }

      saveProjects(remaining);
      showCrudInfo(`Deleted project with ID ${id}. Reload "Load Local" on About page to see updated list.`);
      form.reset();
    });
  }
});
