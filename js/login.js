(function initializeLoginPage(global) {
  "use strict";

  const auth = global.CourseMarkAuth;
  const utils = global.CourseMarkUtils;

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const message = document.getElementById("login-message");
    const submitButton = form?.querySelector('button[type="submit"]');
    const forgotPasswordButton = document.getElementById("forgot-password-btn");
    const googleButton = document.getElementById("google-btn");

    if (!form) return;

    if (global.location.protocol === "file:") {
      utils.showMessage(
        message,
        "Open CourseMark through a local web server, such as VS Code Live Server.",
        "warning",
      );
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      utils.clearMessage(message);

      const email = document.getElementById("email")?.value.trim() || "";
      const password = document.getElementById("password")?.value || "";

      if (!utils.validateEmail(email)) {
        utils.showMessage(message, "Enter a valid email address.");
        return;
      }

      if (!password) {
        utils.showMessage(message, "Enter your password.");
        return;
      }

      utils.setButtonLoading(submitButton, true, "Logging in...");

      try {
        const { user } = await auth.login(email, password);
        const profile = await auth.getProfile(user.id);

        utils.showMessage(
          message,
          "Login successful. Redirecting...",
          "success",
        );
        await auth.redirectByRole(profile, user);
      } catch (error) {
        console.error("Login failed:", error);
        utils.showMessage(message, utils.getFriendlyAuthError(error));
      } finally {
        utils.setButtonLoading(submitButton, false);
      }
    });

    forgotPasswordButton?.addEventListener("click", async () => {
      const email = document.getElementById("email")?.value.trim() || "";

      if (!utils.validateEmail(email)) {
        utils.showMessage(message, "Enter your email address first.");
        document.getElementById("email")?.focus();
        return;
      }

      try {
        await auth.resetPassword(email);
        utils.showMessage(
          message,
          "Password reset instructions were sent to your email.",
          "success",
        );
      } catch (error) {
        utils.showMessage(message, utils.getFriendlyAuthError(error));
      }
    });

    googleButton?.addEventListener("click", async () => {
      try {
        await auth.loginWithGoogle();
      } catch (error) {
        utils.showMessage(message, utils.getFriendlyAuthError(error));
      }
    });
  });
})(window);
