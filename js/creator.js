(function initializeCreatorDashboard(global) {
  "use strict";

  const auth = global.CourseMarkAuth;
  const utils = global.CourseMarkUtils;

  document.addEventListener("DOMContentLoaded", async () => {
    const logoutLink = document.querySelector("[data-creator-logout]");
    const heading = document.querySelector(".dashboard > h1");
    const uploadForm = document.querySelector(".upload-studio form");

    logoutLink?.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        await auth.logout();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });

    try {
      const context = await auth.requireAuth("creator");
      if (!context) return;

      const fullName =
        context.profile?.full_name ||
        context.user.user_metadata?.full_name;

      if (heading && fullName) {
        heading.textContent = `Creator Dashboard - ${fullName}`;
      }
    } catch (error) {
      console.error("Unable to load the creator dashboard:", error);
      global.location.replace("login.html");
      return;
    }

    uploadForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      let message = uploadForm.querySelector(".status-message");
      if (!message) {
        message = document.createElement("p");
        message.className = "status-message";
        message.setAttribute("role", "status");
        uploadForm.append(message);
      }

      utils.showMessage(
        message,
        "Course upload tools are ready for backend integration.",
        "info",
      );
    });
  });
})(window);
