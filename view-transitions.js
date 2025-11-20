if ("startViewTransition" in document) {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-vt-nav]");
    if (!link || link.origin !== location.origin) return;

    event.preventDefault();
    const url = link.href;

    document.startViewTransition(() => {
      window.location.href = url;
    });
  });
}