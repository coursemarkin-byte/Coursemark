(function initializeCreatorDashboard(global) {
  "use strict";

  const auth = global.CourseMarkAuth;
  const utils = global.CourseMarkUtils;

  const stats = [
    { label: "Courses", value: "8", icon: "book-open", detail: "6 published" },
    {
      label: "Students",
      value: "1,280",
      icon: "users",
      detail: "+84 this month",
    },
    {
      label: "Revenue",
      value: "₹24,800",
      icon: "indian-rupee",
      detail: "This month",
    },
    { label: "Rating", value: "4.9", icon: "star", detail: "From 326 reviews" },
  ];

  const recentActivity = [
    {
      icon: "user-plus",
      title: "New learner joined Kerala Cooking Masterclass",
      time: "10 minutes ago",
    },
    {
      icon: "star",
      title: "A 5-star review was added to Advanced Baking Techniques",
      time: "1 hour ago",
    },
    {
      icon: "credit-card",
      title: "₹3,200 course revenue was recorded",
      time: "3 hours ago",
    },
    {
      icon: "book-open-check",
      title: "Mindful Yoga course materials were updated",
      time: "Yesterday",
    },
  ];

  const courses = [
    {
      thumbnail:
        "https://images.unsplash.com/photo-1511689981-0b7e34efffe1?auto=format&fit=crop&w=180&q=80",
      title: "Kerala Cooking Masterclass",
      students: 325,
      rating: 4.8,
      status: "Published",
      action: "Manage",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=180&q=80",
      title: "Advanced Baking Techniques",
      students: 210,
      rating: 4.9,
      status: "Published",
      action: "Manage",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1544213456-bf366f2f7df4?auto=format&fit=crop&w=180&q=80",
      title: "Mindful Yoga for Creators",
      students: 145,
      rating: 4.7,
      status: "Draft",
      action: "Edit",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=180&q=80",
      title: "Instagram Growth for Creators",
      students: 96,
      rating: 4.6,
      status: "Pending Review",
      action: "Review",
    },
  ];

  const reviews = [
    {
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
      name: "Amaya Patel",
      course: "Kerala Cooking Masterclass",
      rating: 5,
      feedback:
        "Beautifully structured and easy to follow. I can confidently make the recipes now.",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=100&q=80",
      name: "Rahul Verma",
      course: "Advanced Baking Techniques",
      rating: 5,
      feedback: "Clear lessons, practical recipes, and exactly the right pace.",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80",
      name: "Nisha Rao",
      course: "Mindful Yoga for Creators",
      rating: 4,
      feedback:
        "The mindfulness guidance is calm, useful, and beginner friendly.",
    },
  ];

  const revenueSets = {
    7: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [2400, 2800, 3200, 3000, 3400, 3700, 4100],
    },
    30: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [14800, 17200, 19400, 24800],
    },
    365: {
      labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"],
      values: [42000, 51000, 59000, 68000, 74000, 91000, 108000],
    },
  };

  const modalTemplates = {
    "new-course": {
      eyebrow: "Course builder",
      title: "Create a new course",
      content: `
        <form class="dashboard-form" data-demo-form="Course draft">
          <label>Course title<input name="title" required placeholder="e.g. Kerala Cooking Essentials"></label>
          <label>Category
            <select name="category" required>
              <option value="">Choose a category</option>
              <option>Cooking</option><option>Wellness</option><option>Business</option>
              <option>Art & Craft</option><option>Marketing</option>
            </select>
          </label>
          <label>Short description<textarea name="description" required placeholder="What will learners achieve?"></textarea></label>
          <button type="submit">Save course draft</button>
        </form>`,
    },
    "upload-lesson": {
      eyebrow: "Course content",
      title: "Upload a lesson",
      content: `
        <form class="dashboard-form" data-demo-form="Lesson">
          <label>Course<select required><option>Kerala Cooking Masterclass</option><option>Advanced Baking Techniques</option><option>Mindful Yoga for Creators</option></select></label>
          <label>Lesson title<input required placeholder="Lesson title"></label>
          <label>Video file<input type="file" accept="video/*" required></label>
          <button type="submit">Prepare lesson upload</button>
        </form>`,
    },
    "create-coupon": {
      eyebrow: "Promotion",
      title: "Create a coupon",
      content: `
        <form class="dashboard-form" data-demo-form="Coupon">
          <label>Coupon code<input required placeholder="ONAM25"></label>
          <label>Discount percentage<input type="number" min="1" max="90" required placeholder="25"></label>
          <label>Expiry date<input type="date" required></label>
          <button type="submit">Create coupon</button>
        </form>`,
    },
    withdraw: {
      eyebrow: "Creator earnings",
      title: "Withdraw earnings",
      content: `<div class="modal-note"><strong>Available balance: ₹18,400</strong><p>Payout account setup will connect here when the payments backend is enabled.</p></div>`,
    },
    notifications: {
      eyebrow: "Updates",
      title: "Notifications",
      content: `<div class="modal-note"><strong>You are all caught up.</strong><p>New enrollments, reviews, and payout updates will appear here.</p></div>`,
    },
  };

  function renderStats() {
    const container = document.getElementById("creator-stats");
    if (!container) return;
    container.innerHTML = stats
      .map(
        (item) => `
      <article class="stat-card">
        <div class="stat-card-header"><div class="stat-card-icon"><i data-lucide="${item.icon}"></i></div></div>
        <h3>${item.value}</h3><p>${item.label}</p><span>${item.detail}</span>
      </article>`,
      )
      .join("");
  }

  function renderActivity() {
    const container = document.getElementById("recent-activity");
    if (!container) return;
    container.innerHTML = recentActivity
      .map(
        (item) => `
      <div class="timeline-item" data-searchable="${utils.escapeHtml(item.title.toLowerCase())}">
        <div class="timeline-icon"><i data-lucide="${item.icon}"></i></div>
        <div class="timeline-body"><p>${utils.escapeHtml(item.title)}</p><span>${item.time}</span></div>
      </div>`,
      )
      .join("");
  }

  function renderCourses() {
    const body = document.getElementById("courses-table-body");
    if (!body) return;
    body.innerHTML = courses
      .map(
        (course, index) => `
      <tr data-searchable="${utils.escapeHtml(`${course.title} ${course.status}`.toLowerCase())}">
        <td><img class="course-image" src="${course.thumbnail}" alt=""></td>
        <td><strong>${utils.escapeHtml(course.title)}</strong></td>
        <td>${course.students}</td><td>${course.rating} ★</td>
        <td><span class="badge-pill badge-${course.status.toLowerCase().replaceAll(" ", "-")}">${course.status}</span></td>
        <td><button class="table-action" type="button" data-course-index="${index}">${course.action}</button></td>
      </tr>`,
      )
      .join("");
  }

  function renderReviews() {
    const container = document.getElementById("review-list");
    if (!container) return;
    container.innerHTML = reviews
      .map(
        (review) => `
      <article class="review-card" data-searchable="${utils.escapeHtml(`${review.name} ${review.course} ${review.feedback}`.toLowerCase())}">
        <div class="review-head">
          <img src="${review.avatar}" alt="${utils.escapeHtml(review.name)}">
          <div><h3>${utils.escapeHtml(review.name)}</h3><div class="review-meta"><span>${review.rating} ★</span><span>${utils.escapeHtml(review.course)}</span></div></div>
        </div>
        <div class="review-body"><p>${utils.escapeHtml(review.feedback)}</p></div>
      </article>`,
      )
      .join("");
  }

  function renderRevenueChart(range = "7") {
    const container = document.getElementById("revenue-chart");
    const data = revenueSets[range] || revenueSets[7];
    if (!container) return;

    const width = Math.max(container.clientWidth, 360);
    const height = 260;
    const padding = 30;
    const maxValue = Math.max(...data.values);
    const points = data.values.map((value, index) => ({
      x:
        padding +
        (index * (width - padding * 2)) / Math.max(data.values.length - 1, 1),
      y: height - padding - (value / maxValue) * (height - padding * 2),
      label: data.labels[index],
    }));
    const path = points
      .map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`)
      .join(" ");
    const area = `${path} L ${points.at(-1).x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    container.innerHTML = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Revenue trend">
        <defs><linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity=".25"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/></linearGradient></defs>
        <path d="${area}" fill="url(#revenueGradient)"/>
        <path d="${path}" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#f59e0b"/><text x="${point.x}" y="${height - 6}" text-anchor="middle" font-size="10" fill="#64748b">${point.label}</text>`).join("")}
      </svg>`;
  }

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
    }, 3200);
  }

  function openModal(action) {
    if (action === "view-analytics") {
      document
        .getElementById("revenue")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const template = modalTemplates[action];
    const modal = document.getElementById("creator-modal");
    if (!template || !modal) return;

    document.getElementById("modal-eyebrow").textContent = template.eyebrow;
    document.getElementById("modal-title").textContent = template.title;
    document.getElementById("modal-content").innerHTML = template.content;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    refreshIcons();
    modal.querySelector("input, select, textarea, button")?.focus();
  }

  function closeModal() {
    const modal = document.getElementById("creator-modal");
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
  }

  function filterDashboard(query) {
    const normalized = query.trim().toLowerCase();
    const items = [...document.querySelectorAll("[data-searchable]")];
    let courseMatches = 0;

    items.forEach((item) => {
      const matches =
        !normalized || item.dataset.searchable.includes(normalized);
      item.hidden = !matches;
      if (matches && item.matches("tr")) courseMatches += 1;
    });

    const emptyState = document.getElementById("course-search-empty");
    if (emptyState) emptyState.hidden = !normalized || courseMatches > 0;
  }

  function bindInteractions() {
    const sidebar = document.querySelector(".sidebar");
    const profileButton = document.querySelector(".profile-button");
    const dropdown = document.querySelector(".dropdown-menu");

    document.querySelector(".menu-toggle")?.addEventListener("click", () => {
      sidebar?.classList.toggle("open");
      document.body.classList.toggle("sidebar-open");
    });

    profileButton?.addEventListener("click", () => {
      const willOpen = dropdown?.hidden;
      if (dropdown) dropdown.hidden = !willOpen;
      profileButton.setAttribute("aria-expanded", String(Boolean(willOpen)));
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

    document.querySelectorAll("[data-action]").forEach((button) => {
      const action = button.dataset.action;
      if (!action) return;
      button.addEventListener("click", () => openModal(action));
    });

    document.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    document
      .getElementById("creator-modal")
      ?.addEventListener("submit", (event) => {
        event.preventDefault();
        const label = event.target.dataset.demoForm || "Item";
        closeModal();
        showToast(`${label} saved as a local dashboard preview.`);
      });

    document
      .getElementById("dashboard-search")
      ?.addEventListener("input", (event) => {
        filterDashboard(event.target.value);
      });

    document
      .getElementById("revenue-range")
      ?.addEventListener("change", (event) => {
        renderRevenueChart(event.target.value);
      });

    document
      .getElementById("courses-table-body")
      ?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-course-index]");
        if (!button) return;
        const course = courses[Number(button.dataset.courseIndex)];
        if (!course) return;
        showToast(
          `${course.title}: ${course.action} tools are ready for backend integration.`,
        );
      });

    document.querySelectorAll(".sidebar-nav .nav-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        // Active sidebar item
        document
          .querySelectorAll(".sidebar-nav .nav-link")
          .forEach((item) => item.classList.remove("active"));

        link.classList.add("active");

        // Hide every dashboard section
        document.querySelectorAll("main section").forEach((section) => {
          section.hidden = true;
        });

        // Show selected section
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
          target.hidden = false;
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        sidebar?.classList.remove("open");
        document.body.classList.remove("sidebar-open");
      });
    });

    document
      .getElementById("logout-button")
      ?.addEventListener("click", async () => {
        try {
          await auth.logout("login.html");
        } catch (error) {
          showToast(utils.getFriendlyAuthError(error));
        }
      });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
    // Show Dashboard section by default
    document.querySelectorAll("main section").forEach((section) => {
      section.hidden = true;
    });

    document.getElementById("overview").hidden = false;
  }

  async function initializeDashboard() {
    renderStats();
    renderActivity();
    renderCourses();
    renderReviews();
    renderRevenueChart();
    bindInteractions();
    refreshIcons();

    try {
      const context = await auth.requireAuth("creator");
      if (!context) return;

      const creatorName =
        context.profile?.full_name ||
        context.user?.user_metadata?.full_name ||
        "Creator";

      const creatorEmail = context.profile?.email || context.user?.email || "";

      const creatorRole = context.profile?.role || "creator";
      const creatorAvatar =
        context.profile?.avatar_url || "assets/images/default-avatar.png";
      // Welcome message
      const welcomeName = document.getElementById("creator-welcome-name");
      if (welcomeName) {
        welcomeName.textContent = creatorName;
      }

      // Update every element that uses data-creator-name
      document.querySelectorAll("[data-creator-name]").forEach((element) => {
        element.textContent = creatorName;
      });

      // Dropdown information
      const dropdownName = document.getElementById("dropdown-name");
      const dropdownEmail = document.getElementById("dropdown-email");
      const dropdownRole = document.getElementById("dropdown-role");

      if (dropdownName) dropdownName.textContent = creatorName;
      if (dropdownEmail) dropdownEmail.textContent = creatorEmail;

      const headerAvatar = document.getElementById("creator-avatar");
      const dropdownAvatar = document.getElementById("dropdown-avatar");

      if (headerAvatar) {
        headerAvatar.src = creatorAvatar;
      }

      if (dropdownAvatar) {
        dropdownAvatar.src = creatorAvatar;
      }

      if (dropdownRole) {
        dropdownRole.textContent =
          creatorRole.charAt(0).toUpperCase() + creatorRole.slice(1);
      }
    } catch (error) {
      console.error("Unable to load the creator dashboard:", error);
      global.location.replace("login.html");
    }

    global.addEventListener("resize", () => {
      renderRevenueChart(
        document.getElementById("revenue-range")?.value || "7",
      );
    });
  }

  document.addEventListener("DOMContentLoaded", initializeDashboard);
})(window);
