(function initializePublicPage(global) {
  "use strict";

  const auth = global.CourseMarkAuth;

  function renderNavigation(user, profile) {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions) return;

    if (!user) {
      navActions.innerHTML = `
        <a href="login.html" class="nav-login-link">Login</a>
        <a href="signup.html" class="login-btn">Student Sign Up</a>
      `;
      return;
    }

    const role = auth.getUserRole(profile, user);
    const dashboard =
      role === "creator"
        ? "creator-dashboard.html"
        : "student-dashboard.html";

    navActions.innerHTML = `
      <a href="${dashboard}" class="nav-login-link">Dashboard</a>
      <button type="button" class="login-btn" data-auth-logout>Logout</button>
    `;

    navActions
      .querySelector("[data-auth-logout]")
      .addEventListener("click", async () => {
        try {
          await auth.logout("index.html");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      });
  }

  async function refreshNavigation() {
    try {
      const user = await auth.getCurrentUser();
      const profile = user ? await auth.getProfile(user.id) : null;
      renderNavigation(user, profile);
    } catch (error) {
      console.error("Unable to restore the current session:", error);
      renderNavigation(null, null);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll("[data-auth-logout]")
      .forEach((logoutControl) => {
        logoutControl.addEventListener("click", async (event) => {
          event.preventDefault();

          try {
            await auth.logout();
          } catch (error) {
            console.error("Logout failed:", error);
          }
        });
      });

    refreshNavigation();
  });
  auth.onAuthStateChange(() => {
    global.setTimeout(refreshNavigation, 0);
  });
})(window);
