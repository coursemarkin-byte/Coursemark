(function initializeCheckoutPage(global) {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("enrollmentForm");
    const message = document.getElementById("enrollMessage");

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      global.localStorage.setItem("enrolled_KeralaMasterclass", "true");

      if (message) {
        message.hidden = false;
        message.textContent =
          "Request submitted - an administrator will review and contact you for payment if needed.";
      }

      global.setTimeout(() => {
        global.location.href = "course-details.html?enrolled=1";
      }, 1500);
    });
  });
})(window);
