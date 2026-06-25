(function initializeCourseMarkUtils(global) {
  "use strict";

  function showMessage(target, message, type = "error") {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;

    if (!element) return;

    const colors = {
      error: "#c00",
      success: "#15803d",
      warning: "#b45309",
      info: "#475569",
    };

    element.hidden = false;
    element.style.color = colors[type] || colors.info;
    element.textContent = message;
  }

  function clearMessage(target) {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;

    if (!element) return;
    element.textContent = "";
    element.hidden = false;
  }

  function hideLoader(target) {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;

    if (element) element.hidden = true;
  }

  function setButtonLoading(button, isLoading, loadingText = "Please wait...") {
    if (!button) return;

    if (isLoading) {
      button.dataset.originalText = button.textContent;
      button.disabled = true;
      button.textContent = loadingText;
      return;
    }

    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
    delete button.dataset.originalText;
  }

  function formatDate(value, locale = "en-IN") {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function getFriendlyAuthError(error) {
    const message =
      error?.message ||
      error?.error_description ||
      error?.details ||
      (typeof error === "string" ? error : "");
    const normalized = message.toLowerCase();

    if (
      normalized.includes("already registered") ||
      normalized.includes("already exists") ||
      normalized.includes("user already")
    ) {
      return "Email already in use. Please log in instead.";
    }

    if (
      normalized.includes("invalid login credentials") ||
      normalized.includes("invalid credentials")
    ) {
      return "Incorrect email or password.";
    }

    if (
      normalized.includes("email not confirmed") ||
      normalized.includes("not confirmed")
    ) {
      return "Confirm your email address before logging in.";
    }

    if (
      normalized.includes("password") &&
      (normalized.includes("short") ||
        normalized.includes("characters") ||
        normalized.includes("weak"))
    ) {
      return "Password too short. Use at least 6 characters.";
    }

    if (normalized.includes("invalid email")) {
      return "Enter a valid email address.";
    }

    if (
      normalized.includes("rate limit") ||
      normalized.includes("too many requests")
    ) {
      return "Too many attempts. Please wait and try again.";
    }

    return message || "Something went wrong. Please try again.";
  }

  global.CourseMarkUtils = Object.freeze({
    showMessage,
    clearMessage,
    hideLoader,
    setButtonLoading,
    formatDate,
    escapeHtml,
    validateEmail,
    getFriendlyAuthError,
  });
})(window);
