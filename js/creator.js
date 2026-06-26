(function initializeCreatorDashboardModule(global) {
  "use strict";

  const auth = global.CourseMarkAuth;
  const utils = global.CourseMarkUtils;
  const supabase = global.CourseMarkConfig?.supabaseClient;
  const DEFAULT_AVATAR = "assets/images/default-avatar.png";
  const THUMBNAIL_BUCKET = "course-thumbnails";
  const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
  const ALLOWED_THUMBNAIL_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const ALLOWED_THUMBNAIL_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
  const AVATAR_BUCKET = "avatars";

  let currentUser = null;
  let creatorProfile = null;
  let courses = [];
  let courseToDelete = null;
  let activeCourse = null;
  let selectedThumbnailFile = null;
  let thumbnailPreviewUrl = "";
  let selectedAvatarFile = null;
  let avatarPreviewUrl = "";

  function refreshIcons() {
    global.lucide?.createIcons();
  }

  function showToast(message) {
    const toast = document.getElementById("dashboard-toast");
    if (!toast) return;

    toast.textContent = message;
    toast.hidden = false;
    global.clearTimeout(showToast.timer);
    showToast.timer = global.setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  }

  function getAvatarUrl(profile = creatorProfile) {
    return profile?.avatar_url || DEFAULT_AVATAR;
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value || "";
    });
  }

  function setImage(id, src) {
    const image = document.getElementById(id);
    if (!image) return;
    image.src = src || DEFAULT_AVATAR;
  }

  function showSection(id) {
    const targetId = id || "overview";

    document.querySelectorAll("[data-dashboard-section]").forEach((section) => {
      section.hidden = section.id !== targetId;
    });

    document.querySelectorAll(".sidebar-nav .nav-link").forEach((link) => {
      const isActive = link.dataset.section === targetId;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    document.querySelector(".sidebar")?.classList.remove("open");
    document.body.classList.remove("sidebar-open");
  }

  function bindNavigation() {
    const sidebar = document.querySelector(".sidebar");
    const profileButton = document.querySelector(".profile-button");
    const dropdown = document.querySelector(".dropdown-menu");

    document.querySelector(".menu-toggle")?.addEventListener("click", () => {
      sidebar?.classList.toggle("open");
      document.body.classList.toggle("sidebar-open");
    });

    document.querySelectorAll("[data-section]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showSection(link.dataset.section);
        if (dropdown) dropdown.hidden = true;
        profileButton?.setAttribute("aria-expanded", "false");
      });
    });

    profileButton?.addEventListener("click", () => {
      const willOpen = Boolean(dropdown?.hidden);
      if (dropdown) dropdown.hidden = !willOpen;
      profileButton.setAttribute("aria-expanded", String(willOpen));
    });

    document.addEventListener("click", (event) => {
      if (
        !profileButton?.contains(event.target) &&
        !dropdown?.contains(event.target)
      ) {
        if (dropdown) dropdown.hidden = true;
        profileButton?.setAttribute("aria-expanded", "false");
      }
    });

    document
      .getElementById("dashboard-search")
      ?.addEventListener("input", (event) => {
        filterCourses(event.target.value);
      });

    document
      .getElementById("creator-profile-form")
      ?.addEventListener("submit", saveProfile);

    document
      .getElementById("profile-avatar")
      ?.addEventListener("change", (event) => {
        previewAvatar(event.target.files?.[0] || null);
      });

    document.getElementById("logout-button")?.addEventListener("click", logout);

    document.querySelectorAll("[data-add-course]").forEach((button) => {
      button.addEventListener("click", () => openCourseModal());
    });

    document
      .getElementById("course-form")
      ?.addEventListener("submit", saveCourse);

    document
      .getElementById("course-thumbnail")
      ?.addEventListener("change", (event) => {
        previewThumbnail(event.target.files?.[0] || null);
      });

    document.querySelectorAll("[data-course-modal-close]").forEach((button) => {
      button.addEventListener("click", closeCourseModal);
    });

    document.querySelectorAll("[data-delete-modal-close]").forEach((button) => {
      button.addEventListener("click", closeDeleteModal);
    });

    document
      .getElementById("confirm-delete-course")
      ?.addEventListener("click", confirmDeleteCourse);

    document
      .getElementById("courses-table-body")
      ?.addEventListener("click", (event) => {
        const editButton = event.target.closest("[data-edit-course]");
        const deleteButton = event.target.closest("[data-delete-course]");

        if (editButton) {
          editCourse(editButton.dataset.editCourse);
          return;
        }

        if (deleteButton) {
          deleteCourse(deleteButton.dataset.deleteCourse);
        }
      });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeCourseModal();
      closeDeleteModal();
    });
  }

  async function loadCreatorProfile() {
    currentUser = await auth.getCurrentUser();
    if (!currentUser) {
      global.location.replace("login.html");
      return null;
    }

    const authProfile = await auth.getProfile(currentUser.id);
    const role = auth.getUserRole(authProfile, currentUser);
    if (role !== "creator") {
      global.location.replace("student-dashboard.html");
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) throw error;

    creatorProfile = data || {
      id: currentUser.id,
      email: currentUser.email,
      role: "creator",
      full_name: currentUser.user_metadata?.full_name || "Creator",
    };

    renderCreatorProfile();
    populateProfileForm();
    return creatorProfile;
  }

  function renderCreatorProfile() {
    const fullName =
      creatorProfile?.full_name ||
      currentUser?.user_metadata?.full_name ||
      "Creator";
    const email = creatorProfile?.email || currentUser?.email || "";
    const role = creatorProfile?.role || "creator";
    const avatarUrl = getAvatarUrl();

    setText("[data-creator-name]", fullName);
    setText("#creator-welcome-name", fullName);
    setText("#dropdown-name", fullName);
    setText("#dropdown-email", email);
    setText(
      "#dropdown-role",
      role ? role.charAt(0).toUpperCase() + role.slice(1) : "",
    );

    setImage("creator-avatar", avatarUrl);
    setImage("dropdown-avatar", avatarUrl);
    setImage("profile-avatar-preview", avatarUrl);
  }

  function populateProfileForm() {
    const profile = creatorProfile || {};
    const values = {
      "profile-full-name": profile.full_name || "",
      "profile-title": profile.professional_title || "",
      "profile-bio": profile.bio || "",
      "profile-phone": profile.phone || "",
      "profile-website": profile.website || "",
      "profile-instagram": profile.instagram || "",
      "profile-linkedin": profile.linkedin || "",
      "profile-youtube": profile.youtube || "",
      "profile-facebook": profile.facebook || "",
      "profile-experience": profile.experience || "",
      "profile-languages": profile.languages || "",
    };

    Object.entries(values).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field) field.value = value;
    });
  }

  function getProfileFormValues() {
    const value = (id) => document.getElementById(id)?.value.trim() || null;

    return {
      full_name: value("profile-full-name"),
      professional_title: value("profile-title"),
      bio: value("profile-bio"),
      phone: value("profile-phone"),
      website: value("profile-website"),
      instagram: value("profile-instagram"),
      linkedin: value("profile-linkedin"),
      youtube: value("profile-youtube"),
      facebook: value("profile-facebook"),
      experience: value("profile-experience"),
      languages: value("profile-languages"),
    };
  }

  async function saveProfile(event) {
    event?.preventDefault();
    if (!currentUser) return;

    const button = document.querySelector(
      "#creator-profile-form button[type='submit']",
    );
    const updates = getProfileFormValues();

    try {
      if (selectedAvatarFile) {
        utils.setButtonLoading(button, true, "Uploading...");
        try {
          updates.avatar_url = await uploadAvatar(selectedAvatarFile);
        } catch (error) {
          console.error("Unable to upload avatar:", error);
          showToast("Unable to upload avatar.");
          utils.setButtonLoading(button, false);
          return;
        }
      } else {
        updates.avatar_url = creatorProfile?.avatar_url || null;
      }

      utils.setButtonLoading(button, true, "Saving...");
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", currentUser.id)
        .select("*")
        .single();

      if (error) throw error;

      creatorProfile = data;
      renderCreatorProfile();
      populateProfileForm();
      selectedAvatarFile = null;
      const avatarInput = document.getElementById("profile-avatar");
      if (avatarInput) avatarInput.value = "";
      clearAvatarPreviewUrl();
      showToast("Profile updated successfully.");
    } catch (error) {
      console.error("Unable to save creator profile:", error);
      showToast(utils.getFriendlyAuthError(error));
    } finally {
      utils.setButtonLoading(button, false);
    }
  }

  async function logout() {
    try {
      await auth.logout("login.html");
    } catch (error) {
      showToast(utils.getFriendlyAuthError(error));
    }
  }

  function openCourseModal(course = null) {
    const modal = document.getElementById("course-modal");
    const form = document.getElementById("course-form");
    if (!modal || !form) return;

    activeCourse = course;
    selectedThumbnailFile = null;
    clearThumbnailPreviewUrl();
    form.reset();
    document.getElementById("course-id").value = course?.id || "";
    document.getElementById("course-thumbnail").value = "";
    setCourseThumbnailPreview(course?.thumbnail || DEFAULT_AVATAR);
    document.getElementById("course-title").value = course?.title || "";
    document.getElementById("course-short-description").value =
      course?.short_description || "";
    document.getElementById("course-full-description").value =
      course?.full_description || "";
    document.getElementById("course-category").value = course?.category || "";
    document.getElementById("course-level").value = course?.level || "";
    document.getElementById("course-language").value = course?.language || "";
    document.getElementById("course-price").value =
      course?.price === null || course?.price === undefined ? "" : course.price;

    const title = document.getElementById("course-modal-title");
    if (title) title.textContent = course ? "Edit Course" : "Add Course";

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    refreshIcons();
    document.getElementById("course-title")?.focus();
  }

  function closeCourseModal() {
    const modal = document.getElementById("course-modal");
    if (modal) modal.hidden = true;
    activeCourse = null;
    selectedThumbnailFile = null;
    clearThumbnailPreviewUrl();
    document.body.style.overflow = "";
  }

  function validateThumbnail(file) {
    if (!file) return "";
    const filename = String(file.name || "").toLowerCase();
    const hasAllowedType = ALLOWED_THUMBNAIL_TYPES.includes(file.type);
    const hasAllowedExtension = ALLOWED_THUMBNAIL_EXTENSIONS.some((extension) =>
      filename.endsWith(extension),
    );

    if (
      (!file.type && !hasAllowedExtension) ||
      (file.type && (!hasAllowedType || !hasAllowedExtension))
    ) {
      return "Only JPG, JPEG, PNG and WEBP images are allowed.";
    }
    if (file.size > MAX_THUMBNAIL_SIZE) {
      return "Thumbnail must be 5 MB or smaller.";
    }
    return "";
  }

  function previewThumbnail(file) {
    const input = document.getElementById("course-thumbnail");
    const validationError = validateThumbnail(file);

    if (validationError) {
      selectedThumbnailFile = null;
      if (input) input.value = "";
      setCourseThumbnailPreview(activeCourse?.thumbnail || DEFAULT_AVATAR);
      showToast(validationError);
      return;
    }

    selectedThumbnailFile = file;
    if (!file) {
      setCourseThumbnailPreview(activeCourse?.thumbnail || DEFAULT_AVATAR);
      return;
    }

    clearThumbnailPreviewUrl();
    thumbnailPreviewUrl = URL.createObjectURL(file);
    setCourseThumbnailPreview(thumbnailPreviewUrl);
  }

  function setCourseThumbnailPreview(src) {
    const preview = document.getElementById("course-thumbnail-preview");
    if (!preview) return;
    preview.src = src || DEFAULT_AVATAR;
  }

  function clearThumbnailPreviewUrl() {
    if (!thumbnailPreviewUrl) return;
    URL.revokeObjectURL(thumbnailPreviewUrl);
    thumbnailPreviewUrl = "";
  }

  function previewAvatar(file) {
    const input = document.getElementById("profile-avatar");
    const validationError = validateThumbnail(file);

    if (validationError) {
      selectedAvatarFile = null;
      if (input) input.value = "";
      setProfileAvatarPreview(getAvatarUrl());
      showToast(validationError);
      return;
    }

    selectedAvatarFile = file;
    if (!file) {
      setProfileAvatarPreview(getAvatarUrl());
      return;
    }

    clearAvatarPreviewUrl();
    avatarPreviewUrl = URL.createObjectURL(file);
    setProfileAvatarPreview(avatarPreviewUrl);
  }

  function setProfileAvatarPreview(src) {
    setImage("creator-avatar", src || DEFAULT_AVATAR);
    setImage("dropdown-avatar", src || DEFAULT_AVATAR);
    setImage("profile-avatar-preview", src || DEFAULT_AVATAR);
  }

  function clearAvatarPreviewUrl() {
    if (!avatarPreviewUrl) return;
    URL.revokeObjectURL(avatarPreviewUrl);
    avatarPreviewUrl = "";
  }

  function getSafeFilename(filename) {
    const safeFilename = String(filename || "thumbnail")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return safeFilename || "thumbnail";
  }

  async function uploadThumbnail(file) {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    const validationError = validateThumbnail(file);
    if (validationError) throw new Error(validationError);

    const safeFilename = getSafeFilename(file.name);
    const path = `${currentUser.id}/${Date.now()}-${safeFilename}`;
    const { error } = await supabase.storage
      .from(THUMBNAIL_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });
    if (error) {
      console.error("Supabase storage upload error (thumbnail):", error);
      throw error;
    }

    const { data } = supabase.storage.from(THUMBNAIL_BUCKET).getPublicUrl(path);

    return data.publicUrl;
  }

  async function uploadAvatar(file) {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    const validationError = validateThumbnail(file);
    if (validationError) throw new Error(validationError);

    const safeFilename = getSafeFilename(file.name);
    const path = `${currentUser.id}/${Date.now()}-${safeFilename}`;
    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });
    if (error) {
      console.error("Supabase storage upload error (avatar):", error);
      throw error;
    }

    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function loadCourses() {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("creator_id", currentUser.id)
      .order("title", { ascending: true });

    if (error) throw error;

    courses = data || [];
    renderCourses();
  }

  function renderCourses() {
    const body = document.getElementById("courses-table-body");
    if (!body) return;

    if (!courses.length) {
      body.innerHTML = `
        <tr data-empty-row>
          <td colspan="6" class="table-empty">No courses created yet.</td>
        </tr>`;
      return;
    }

    body.innerHTML = courses
      .map((course) => {
        const title = utils.escapeHtml(course.title || "Untitled course");
        const category = utils.escapeHtml(course.category || "");
        const status = utils.escapeHtml(formatStatus(course.status));
        const searchable = utils.escapeHtml(
          `${course.title || ""} ${course.category || ""} ${course.status || ""}`.toLowerCase(),
        );

        return `
          <tr data-searchable="${searchable}">
            <td>
              <img
                class="course-image"
                src="${utils.escapeHtml(course.thumbnail || DEFAULT_AVATAR)}"
                alt=""
              />
            </td>
            <td><strong>${title}</strong></td>
            <td>${category}</td>
            <td>${formatPrice(course.price)}</td>
            <td>
              <span class="badge-pill badge-${getStatusClass(course.status)}">
                ${status}
              </span>
            </td>
            <td>
              <div class="course-actions">
                <button class="table-action" type="button" data-edit-course="${utils.escapeHtml(course.id)}">
                  Edit
                </button>
                <button class="table-action delete-action" type="button" data-delete-course="${utils.escapeHtml(course.id)}">
                  Delete
                </button>
              </div>
            </td>
          </tr>`;
      })
      .join("");

    filterCourses(document.getElementById("dashboard-search")?.value || "");
    refreshIcons();
  }

  function getCourseFormValues() {
    const value = (id) => document.getElementById(id)?.value.trim() || "";
    const price = Number(value("course-price"));

    return {
      title: value("course-title"),
      short_description: value("course-short-description"),
      full_description: value("course-full-description") || null,
      category: value("course-category"),
      level: value("course-level") || null,
      language: value("course-language") || null,
      price,
    };
  }

  function validateCourse(values) {
    if (!values.title) return "Course title is required.";
    if (!values.short_description) return "Short description is required.";
    if (!values.category) return "Category is required.";
    if (!Number.isFinite(values.price) || values.price < 0) {
      return "Enter a valid price.";
    }
    return "";
  }

  async function saveCourse(event) {
    event.preventDefault();
    if (!currentUser) return;

    const form = document.getElementById("course-form");
    const button = form?.querySelector("button[type='submit']");
    const courseId = document.getElementById("course-id")?.value;
    const values = getCourseFormValues();
    const validationError = validateCourse(values);

    if (validationError) {
      showToast(validationError);
      return;
    }

    try {
      if (selectedThumbnailFile) {
        utils.setButtonLoading(button, true, "Uploading...");
        try {
          values.thumbnail = await uploadThumbnail(selectedThumbnailFile);
        } catch (error) {
          console.error("Unable to upload thumbnail:", error);
          showToast("Unable to upload thumbnail.");
          return;
        }
      } else {
        utils.setButtonLoading(button, true, "Saving...");
        values.thumbnail = activeCourse?.thumbnail || null;
      }

      if (button) button.textContent = "Saving...";

      if (courseId) {
        const { error } = await supabase
          .from("courses")
          .update(values)
          .eq("id", courseId)
          .eq("creator_id", currentUser.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert({
          ...values,
          creator_id: currentUser.id,
          status: "pending_review",
        });

        if (error) throw error;
      }

      closeCourseModal();
      showToast(
        courseId
          ? "Course updated successfully."
          : "Course created successfully.",
      );
      await loadCourses();
    } catch (error) {
      console.error("Unable to save course:", error);
      showToast(utils.getFriendlyAuthError(error));
    } finally {
      utils.setButtonLoading(button, false);
    }
  }

  function editCourse(courseId) {
    const course = courses.find((item) => String(item.id) === String(courseId));
    if (!course) return;
    openCourseModal(course);
  }

  function deleteCourse(courseId) {
    const course = courses.find((item) => String(item.id) === String(courseId));
    if (!course) return;

    courseToDelete = course;
    const modal = document.getElementById("delete-course-modal");
    if (!modal) return;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("confirm-delete-course")?.focus();
  }

  function closeDeleteModal() {
    const modal = document.getElementById("delete-course-modal");
    if (modal) modal.hidden = true;
    courseToDelete = null;
    document.body.style.overflow = "";
  }

  async function confirmDeleteCourse() {
    if (!courseToDelete || !currentUser) return;

    const button = document.getElementById("confirm-delete-course");

    try {
      utils.setButtonLoading(button, true, "Deleting...");
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseToDelete.id)
        .eq("creator_id", currentUser.id);

      if (error) throw error;

      closeDeleteModal();
      await loadCourses();
    } catch (error) {
      console.error("Unable to delete course:", error);
      showToast(utils.getFriendlyAuthError(error));
    } finally {
      utils.setButtonLoading(button, false);
    }
  }

  function filterCourses(query) {
    const emptyRow = document.querySelector("[data-empty-row]");
    const searchableRows = [
      ...document.querySelectorAll("#courses-table-body tr[data-searchable]"),
    ];
    const emptySearch = document.getElementById("course-search-empty");
    const normalized = query.trim().toLowerCase();

    if (emptyRow) {
      emptyRow.hidden = false;
      if (emptySearch) emptySearch.hidden = true;
      return;
    }

    let matches = 0;
    searchableRows.forEach((row) => {
      const isMatch =
        !normalized || row.dataset.searchable.includes(normalized);
      row.hidden = !isMatch;
      if (isMatch) matches += 1;
    });

    if (emptySearch) emptySearch.hidden = !normalized || matches > 0;
  }

  function formatPrice(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  }

  function formatStatus(status) {
    return String(status || "pending_review")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function getStatusClass(status) {
    return String(status || "pending_review").replaceAll("_", "-");
  }

  function renderRevenuePlaceholder() {
    const chart = document.getElementById("revenue-chart");
    if (!chart) return;

    chart.innerHTML = `
      <div class="chart-placeholder">
        <i data-lucide="chart-no-axes-combined"></i>
        <span>Revenue data will appear here after your first sale.</span>
      </div>`;
  }

  async function initializeDashboard() {
    try {
      bindNavigation();
      showSection("overview");
      renderRevenuePlaceholder();
      await loadCreatorProfile();
      await loadCourses();
      refreshIcons();
    } catch (error) {
      console.error("Unable to load the creator dashboard:", error);
      global.location.replace("login.html");
    }
  }

  global.CourseMarkCreatorDashboard = Object.freeze({
    initializeDashboard,
    bindNavigation,
    loadCreatorProfile,
    populateProfileForm,
    saveProfile,
    openCourseModal,
    closeCourseModal,
    uploadThumbnail,
    uploadAvatar,
    previewThumbnail,
    previewAvatar,
    loadCourses,
    renderCourses,
    saveCourse,
    editCourse,
    deleteCourse,
    logout,
    showSection,
  });

  document.addEventListener("DOMContentLoaded", initializeDashboard);
})(window);
