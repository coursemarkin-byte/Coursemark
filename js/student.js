(function initializeStudentDashboard(global) {
  "use strict";

  const auth = global.CourseMarkAuth;

  document.addEventListener("DOMContentLoaded", async () => {
    const welcome = document.getElementById("welcome-name");
    const logoutButton = document.getElementById("logout-btn");

    logoutButton?.addEventListener("click", async () => {
      try {
        await auth.logout();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });

    try {
      const context = await auth.requireAuth("student");
      if (!context) return;

      const fullName =
        context.profile?.full_name ||
        context.user.user_metadata?.full_name ||
        context.user.email ||
        "Student";

      if (welcome) welcome.textContent = `Welcome, ${fullName}`;
    } catch (error) {
      console.error("Unable to load the student dashboard:", error);
      global.location.replace("login.html");
    }
  });
})(window);
