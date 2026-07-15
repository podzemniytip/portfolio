const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (element.closest(".hero")) element.style.transitionDelay = `${index * 80}ms`;
  observer.observe(element);
});

document.querySelectorAll("a[target='_blank']").forEach((link) => {
  link.addEventListener("click", () => {
    link.dataset.visited = "true";
  });
});
