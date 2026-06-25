(function initializeSignupPage(global) {
  "use strict";

  const auth = global.CourseMarkAuth;
  const utils = global.CourseMarkUtils;

  function getFieldValue(id) {
    return document.getElementById(id)?.value.trim() || "";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
    const message = document.getElementById("signup-message");
    const submitButton = document.getElementById("signup-btn");

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

      const fullName = getFieldValue("full-name");
      const email = getFieldValue("email");
      const password = document.getElementById("password")?.value || "";
      const confirmPassword =
        document.getElementById("confirm-password")?.value || "";
      const role = document.getElementById("role")?.value || "";

      if (fullName.length < 2) {
        utils.showMessage(message, "Please enter your full name.");
        return;
      }

      if (!utils.validateEmail(email)) {
        utils.showMessage(message, "Enter a valid email address.");
        return;
      }

      if (password.length < 6) {
        utils.showMessage(
          message,
          "Password too short. Use at least 6 characters.",
        );
        return;
      }

      if (password !== confirmPassword) {
        utils.showMessage(message, "Passwords do not match.");
        return;
      }

      if (!["student", "creator"].includes(role)) {
        utils.showMessage(message, "Choose a valid account type.");
        return;
      }

      utils.setButtonLoading(submitButton, true, "Creating account...");

      try {
        const data = await auth.signup({
          fullName,
          email,
          password,
          role,
        });

        if (data.session) {
          await auth.logout(null);
        }

        utils.showMessage(
          message,
          data.session
            ? "Account created successfully. Redirecting to login..."
            : "Account created. Confirm your email, then log in.",
          "success",
        );

        form.reset();
        global.setTimeout(() => global.location.replace("login.html"), 1200);
      } catch (error) {
        console.error("Signup failed:", error);
        utils.showMessage(message, utils.getFriendlyAuthError(error));
      } finally {
        utils.setButtonLoading(submitButton, false);
      }
    });
  });
})(window);
