(function initializeCoursesPage() {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".page-search");
    const searchInput = searchForm?.querySelector('input[type="search"]');
    const filterButtons = [
      ...document.querySelectorAll(".course-filters button"),
    ];
    const cards = [...document.querySelectorAll(".course-card")];

    function filterCourses(query) {
      const normalizedQuery = query.trim().toLowerCase();

      cards.forEach((card) => {
        const cardText = card.textContent.toLowerCase();
        const priceText = card.querySelector("h4")?.textContent || "";
        const numericPrice = Number(priceText.replace(/[^\d]/g, ""));
        const matchesUnderOneThousand =
          normalizedQuery === "under rs. 1000" && numericPrice < 1000;
        const matchesText = cardText.includes(normalizedQuery);

        card.hidden =
          normalizedQuery !== "" &&
          !matchesUnderOneThousand &&
          !matchesText;
      });
    }

    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      filterCourses(searchInput?.value || "");
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        const filter = button.textContent.trim();
        filterCourses(filter === "All" ? "" : filter);
      });
    });
  });
})();
