(function initializeCourseDetailsPage(global) {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const courseKey = "enrolled_KeralaMasterclass";
    const enrollLink = document.querySelector(".price-action-link");
    const player = document.getElementById("coursePlayer");

    function setEnrolledUI() {
      if (!enrollLink) return;

      enrollLink.classList.add("enrolled");
      enrollLink.textContent = "Enrolled - Start Course";
      enrollLink.href = "#coursePlayer";
      enrollLink.style.background = "#16a34a";
      enrollLink.style.color = "#ffffff";
    }

    function removeStartButton() {
      document.getElementById("startCourseBtn")?.remove();
    }

    function createStartButton() {
      removeStartButton();
      if (!player) return;

      const button = document.createElement("button");
      button.id = "startCourseBtn";
      button.textContent = "Start Course";
      button.style.display = "block";
      button.style.margin = "12px 0";
      button.style.background = "#16a34a";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.padding = "10px 14px";
      button.style.borderRadius = "8px";
      button.style.cursor = "pointer";
      button.addEventListener("click", () => {
        player.play().catch(() => player.focus());
        removeStartButton();
      });

      player.insertAdjacentElement("afterend", button);
    }

    function goToPlayer(allowAutoplay = true) {
      if (!player) return;

      player.scrollIntoView({ behavior: "smooth" });
      if (!allowAutoplay) {
        createStartButton();
        return;
      }

      player.play().then(removeStartButton).catch(createStartButton);
    }

    if (global.localStorage.getItem(courseKey)) setEnrolledUI();

    enrollLink?.addEventListener("click", (event) => {
      if (!enrollLink.classList.contains("enrolled")) return;
      event.preventDefault();
      goToPlayer(true);
    });

    if (new URLSearchParams(global.location.search).get("enrolled") === "1") {
      global.localStorage.setItem(courseKey, "true");
      setEnrolledUI();
      global.setTimeout(() => goToPlayer(false), 200);
    }
  });
})(window);
