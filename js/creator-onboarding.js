(function initializeCreatorOnboarding(global) {
  "use strict";

  const onboardingForm = document.querySelector("#creatorOnboardingForm");
  if (!onboardingForm) return;

  const { escapeHtml } = global.CourseMarkUtils;
  const steps = [...onboardingForm.querySelectorAll(".form-step")];
  const progressItems = [...document.querySelectorAll(".onboarding-progress li")];
  const progressFill = document.querySelector(".progress-track span");
  const nextButton = onboardingForm.querySelector("[data-next]");
  const prevButton = onboardingForm.querySelector("[data-prev]");
  const submitButton = onboardingForm.querySelector("[data-submit]");
  const summary = document.querySelector("#applicationSummary");
  const successState = document.querySelector("#onboardingSuccess");
  let currentStep = 0;

  function fieldValue(field) {
    if (field.type === "file") {
      return field.files && field.files.length ? field.files[0].name : "Not uploaded";
    }
    if (field.type === "checkbox") {
      return field.checked ? "Agreed" : "Not agreed";
    }
    return field.value || "Not provided";
  }

  function buildSummary() {
    const fields = [...onboardingForm.elements].filter((field) => {
      return field.name && field.type !== "button" && field.type !== "submit" && field.type !== "checkbox";
    });

    summary.innerHTML = fields
      .map((field) => {
        return `<div><span>${escapeHtml(field.name)}</span><strong>${escapeHtml(fieldValue(field))}</strong></div>`;
      })
      .join("");
  }

  function showStep(index) {
    steps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
    });

    progressItems.forEach((item, itemIndex) => {
      item.classList.toggle("active", itemIndex <= index);
    });

    progressFill.style.width = `${((index + 1) / steps.length) * 100}%`;
    prevButton.hidden = index === 0;
    nextButton.hidden = index === steps.length - 1;
    submitButton.hidden = index !== steps.length - 1;

    if (index === steps.length - 1) {
      buildSummary();
    }
  }

  nextButton.addEventListener("click", () => {
    const currentFields = [...steps[currentStep].querySelectorAll("input, select, textarea")];
    const isValid = currentFields.every((field) => field.reportValidity());

    if (!isValid) return;
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    showStep(currentStep);
  });

  prevButton.addEventListener("click", () => {
    currentStep = Math.max(currentStep - 1, 0);
    showStep(currentStep);
  });

  onboardingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const agreed = [...onboardingForm.querySelectorAll("input[type='checkbox']")].every((box) => {
      return box.reportValidity() && box.checked;
    });

    if (!agreed) return;
    steps.forEach((step) => step.classList.remove("active"));
    onboardingForm.querySelector(".form-actions").hidden = true;
    successState.hidden = false;
    progressFill.style.width = "100%";
    progressItems.forEach((item) => item.classList.add("active"));
  });

  showStep(currentStep);
})(window);
