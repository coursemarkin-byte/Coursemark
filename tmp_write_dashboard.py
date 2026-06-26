from pathlib import Path

root = Path(r'e:/Course Mark')
html = '''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Creator Dashboard | CourseMark</title>
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/dashboard.css" />
  </head>
  <body>
    <div class="dashboard-app">
      <aside class="sidebar" aria-label="Primary navigation">
        <div class="sidebar-brand">
          <a href="creator-dashboard.html" class="logo">CourseMark</a>
        </div>
        <nav class="sidebar-nav" aria-label="Dashboard navigation">
          <a href="creator-dashboard.html" class="nav-link active">
            <i data-lucide="home"></i>
            <span>Dashboard</span>
          </a>
          <a href="#my-courses" class="nav-link">
            <i data-lucide="book-open"></i>
            <span>Courses</span>
          </a>
          <a href="#students" class="nav-link">
            <i data-lucide="users"></i>
            <span>Students</span>
          </a>
          <a href="#reviews" class="nav-link">
            <i data-lucide="star"></i>
            <span>Reviews</span>
          </a>
          <a href="#revenue" class="nav-link">
            <i data-lucide="activity"></i>
            <span>Revenue</span>
          </a>
          <a href="instructor-profile.html" class="nav-link">
            <i data-lucide="user"></i>
            <span>Profile</span>
          </a>
        </nav>
      </aside>

      <div class="dashboard-main">
        <header class="topbar">
          <button class="menu-toggle" type="button" aria-label="Open navigation">
            <i data-lucide="menu"></i>
          </button>

          <div class="search-box">
            <i data-lucide="search"></i>
            <input
              type="search"
              placeholder="Search courses, students, reviews..."
              aria-label="Search"
            />
          </div>

          <div class="topbar-actions">
            <button class="icon-button" type="button" aria-label="Notifications">
              <i data-lucide="bell"></i>
              <span class="badge-dot"></span>
            </button>
            <button class="icon-button" type="button" aria-label="Messages">
              <i data-lucide="mail"></i>
            </button>
            <div class="profile-dropdown">
              <button class="profile-button" type="button" aria-expanded="false">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                  alt="Creator avatar"
                />
                <span data-creator-name>Priya Sharma</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="dropdown-menu" hidden>
                <a href="instructor-profile.html">View Profile</a>
                <button id="logout-button" type="button">Logout</button>
              </div>
            </div>
          </div>
        </header>

        <main class="page-content">
          <section class="welcome-panel">
            <div>
              <p class="eyebrow">Welcome back, Priya</p>
              <h1>Manage your courses and grow your creator business.</h1>
              <p>Minimal dashboards for independent creators who value clarity.</p>
            </div>
            <button class="btn-primary btn-pill">New Course</button>
          </section>

          <section class="stats-grid" id="creator-stats"></section>

          <section class="content-grid">
            <article class="panel revenue-panel" id="revenue">
              <div class="panel-heading">
                <div>
                  <p class="eyebrow">Revenue</p>
                  <h2>Revenue Overview</h2>
                </div>
                <div class="select-input">
                  <select id="revenue-range" aria-label="Select revenue range">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last Year</option>
                  </select>
                </div>
              </div>
              <div class="revenue-summary">
                <div>
                  <span class="summary-label">This month</span>
                  <strong>₹24,800</strong>
                </div>
                <div>
                  <span class="summary-label">Last month</span>
                  <strong>₹18,300</strong>
                </div>
                <div>
                  <span class="summary-label">Growth</span>
                  <strong class="text-success">+35%</strong>
                </div>
              </div>
              <div class="revenue-chart" id="revenue-chart"></div>
            </article>

            <article class="panel activity-panel" id="students">
              <div class="panel-heading">
                <div>
                  <p class="eyebrow">Activity</p>
                  <h2>Recent Activity</h2>
                </div>
              </div>
              <div class="timeline" id="recent-activity"></div>
            </article>
          </section>

          <section class="panel courses-panel" id="my-courses">
            <div class="panel-heading">
              <div>
                <p class="eyebrow">My Courses</p>
                <h2>Courses Overview</h2>
              </div>
            </div>
            <div class="table-wrap">
              <table class="course-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Course</th>
                    <th>Students</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="courses-table-body"></tbody>
              </table>
            </div>
          </section>

          <section class="panel reviews-panel" id="reviews">
            <div class="panel-heading">
              <div>
                <p class="eyebrow">Reviews</p>
                <h2>Latest Reviews</h2>
              </div>
            </div>
            <div class="reviews-list" id="review-list"></div>
          </section>
        </main>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/lucide.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
    <script src="js/config.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/creator.js"></script>
    <script>
      lucide.createIcons();
    </script>
  </body>
</html>'''
css = '''@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

:root {
  --primary: #ffb000;
  --surface: #ffffff;
  --surface-soft: #f8fafc;
  --surface-muted: #f1f5f9;
  --border-color: #e5e7eb;
  --text: #0f172a;
  --text-secondary: #64748b;
  --success: #22c55e;
  --shadow-soft: 0 18px 60px rgba(15, 23, 42, 0.08);
  --shadow-card: 0 10px 30px rgba(15, 23, 42, 0.08);
  --radius: 20px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  background: var(--surface-soft);
  color: var(--text);
}

button,
select,
input {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

.dashboard-app {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  gap: 24px;
  padding: 24px;
}

.sidebar {
  position: sticky;
  top: 24px;
  align-self: start;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  padding: 28px 22px;
  gap: 26px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
}

.sidebar-brand .logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.sidebar-nav {
  display: grid;
  gap: 10px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 18px;
  color: var(--text-secondary);
  transition: background 250ms ease, color 250ms ease;
}

.nav-link.active,
.nav-link:hover {
  background: rgba(255, 176, 0, 0.12);
  color: var(--text);
}

.nav-link.active {
  box-shadow: inset 4px 0 0 var(--primary);
}

.nav-link i {
  width: 20px;
  height: 20px;
}

.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  position: sticky;
  top: 24px;
  padding-bottom: 16px;
  background: rgba(248, 250, 252, 0.95);
  backdrop-filter: blur(12px);
  z-index: 10;
}

.menu-toggle {
  display: none;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: #ffffff;
  color: var(--text);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 12px 16px;
}

.search-box i {
  color: var(--text-secondary);
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-button {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: #ffffff;
  display: grid;
  place-items: center;
  color: var(--text-secondary);
}

.badge-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 4px rgba(255, 176, 0, 0.16);
}

.profile-dropdown {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 10px 14px;
  background: #ffffff;
}

.profile-button img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-button span {
  font-weight: 700;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 200px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: var(--shadow-soft);
  padding: 12px;
  display: grid;
  gap: 8px;
}

.dropdown-menu a,
.dropdown-menu button {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 14px;
  padding: 12px 14px;
  color: var(--text);
  cursor: pointer;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background: var(--surface-soft);
}

.welcome-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-card);
}

.welcome-panel .eyebrow {
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  margin-bottom: 10px;
}

.welcome-panel h1 {
  font-size: clamp(2rem, 2.4vw, 2.5rem);
  margin: 0;
  line-height: 1.05;
}

.welcome-panel p {
  color: var(--text-secondary);
  max-width: 520px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.stat-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.stat-card-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #f8fafc;
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 10px;
}

.stat-card p,
.stat-card span {
  margin: 0;
  color: var(--text-secondary);
}

.content-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;
}

.panel {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  padding: 24px;
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 22px;
}

.panel-heading h2 {
  margin: 0;
  font-size: 1.2rem;
}

.select-input select {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 12px 14px;
  background: #ffffff;
  color: var(--text);
}

.revenue-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.revenue-summary div {
  padding: 18px;
  border-radius: 16px;
  background: #f8fafc;
}

.revenue-summary strong {
  display: block;
  margin-top: 8px;
  font-size: 1.3rem;
}

.summary-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.text-success {
  color: var(--success);
}

.revenue-chart {
  min-height: 260px;
}

.timeline {
  display: grid;
  gap: 14px;
}

.timeline-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
}

.timeline-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid var(--border-color);
}

.timeline-body p {
  margin: 0 0 8px;
  font-weight: 700;
}

.timeline-body span {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.table-wrap {
  overflow-x: auto;
}

.course-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;
}

.course-table th,
.course-table td {
  text-align: left;
  padding: 16px 14px;
  border-bottom: 1px solid var(--border-color);
}

.course-table th {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
}

.course-table tbody tr:hover {
  background: #f1f5f9;
}

.course-image {
  width: 56px;
  height: 40px;
  border-radius: 12px;
  object-fit: cover;
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge-published {
  background: #ecfdf5;
  color: #166534;
}

.badge-draft {
  background: #eef2ff;
  color: #4338ca;
}

.badge-pending-review,
.badge-pending {
  background: #fefce8;
  color: #92400e;
}

.reviews-list {
  display: grid;
  gap: 16px;
}

.review-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 18px;
  background: #f8fafc;
}

.review-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.review-head img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.review-head h3 {
  margin: 0;
  font-size: 1rem;
}

.review-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.review-body p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 1100px) {
  .dashboard-app {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .sidebar {
    position: relative;
    top: 0;
    box-shadow: none;
    width: 100%;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .menu-toggle {
    display: inline-flex;
  }

  .sidebar {
    position: fixed;
    inset: 0 auto auto 0;
    width: 260px;
    transform: translateX(-110%);
    transition: transform 250ms ease;
    z-index: 30;
    box-shadow: 18px 0 60px rgba(15, 23, 42, 0.08);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  body.sidebar-open {
    overflow: hidden;
  }

  .dashboard-main {
    padding: 0 16px;
  }

  .stats-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .panel {
    padding: 20px;
  }

  .course-table {
    min-width: 560px;
  }
}
'''
js = '''(function initializeCreatorDashboard(global) {
  "use strict";

  const auth = global.CourseMarkAuth;

  const stats = [
    {
      label: "Courses",
      value: "8",
      icon: "book-open",
      detail: "Live courses",
    },
    {
      label: "Students",
      value: "1,280",
      icon: "users",
      detail: "Total enrolled",
    },
    {
      label: "Revenue",
      value: "₹24,800",
      icon: "activity",
      detail: "This month",
    },
    {
      label: "Rating",
      value: "4.9/5",
      icon: "star",
      detail: "Average score",
    },
  ];

  const recentActivity = [
    {
      icon: "user-plus",
      title: "New student enrolled in Kerala Cooking Masterclass",
      time: "10 minutes ago",
    },
    {
      icon: "star",
      title: "5-star review added for Advanced Baking Techniques",
      time: "1 hour ago",
    },
    {
      icon: "credit-card",
      title: "₹3,200 payment received for Yoga Essentials",
      time: "3 hours ago",
    },
    {
      icon: "book",
      title: "Updated course materials for Mindful Yoga for Creators",
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
        "The course was beautifully structured and easy to follow. I feel confident cooking traditional dishes now!",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=100&q=80",
      name: "Rahul Verma",
      course: "Advanced Baking Techniques",
      rating: 5,
      feedback:
        "The lessons were clear, the recipes were actionable, and the pacing was perfect.",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80",
      name: "Nisha Rao",
      course: "Mindful Yoga for Creators",
      rating: 4,
      feedback:
        "Loved the mindfulness tips and soothing voice. Great for beginners.",
    },
  ];

  const revenueData = {
    thisMonth: [2400, 2800, 3200, 3000, 3400, 3700, 4100],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  function renderStats() {
    const container = document.getElementById("creator-stats");
    if (!container) return;

    container.innerHTML = stats
      .map(
        (item) => `
          <article class="stat-card">
            <div class="stat-card-header">
              <div class="stat-card-icon">
                <i data-lucide="${item.icon}"></i>
              </div>
            </div>
            <h3>${item.value}</h3>
            <p>${item.label}</p>
            <span>${item.detail}</span>
          </article>
        `,
      )
      .join("");
  }

  function renderRecentActivity() {
    const container = document.getElementById("recent-activity");
    if (!container) return;

    container.innerHTML = recentActivity
      .map(
        (item) => `
          <div class="timeline-item">
            <div class="timeline-icon">
              <i data-lucide="${item.icon}"></i>
            </div>
            <div class="timeline-body">
              <p>${item.title}</p>
              <span>${item.time}</span>
            </div>
          </div>
        `,
      )
      .join("");
  }

  function renderCourses() {
    const tbody = document.getElementById("courses-table-body");
    if (!tbody) return;

    tbody.innerHTML = courses
      .map(
        (course) => `
          <tr>
            <td><img class="course-image" src="${course.thumbnail}" alt="${course.title}" /></td>
            <td>${course.title}</td>
            <td>${course.students}</td>
            <td>${course.rating}</td>
            <td><span class="badge-pill badge-${course.status.toLowerCase().replace(/\s/g, "-")}">${course.status}</span></td>
            <td><a href="#" class="table-action">${course.action}</a></td>
          </tr>
        `,
      )
      .join("");
  }

  function renderReviews() {
    const container = document.getElementById("review-list");
    if (!container) return;

    container.innerHTML = reviews
      .map(
        (review) => `
          <article class="review-card">
            <div class="review-head">
              <img src="${review.avatar}" alt="${review.name}" />
              <div>
                <h3>${review.name}</h3>
                <div class="review-meta">
                  <span>${review.rating} ★</span>
                  <span>${review.course}</span>
                </div>
              </div>
            </div>
            <div class="review-body">
              <p>${review.feedback}</p>
            </div>
          </article>
        `,
      )
      .join("");
  }

  function renderRevenueChart() {
    const container = document.getElementById("revenue-chart");
    if (!container) return;

    const width = Math.max(container.clientWidth, 360);
    const height = 260;
    const padding = 24;
    const maxValue = Math.max(...revenueData.thisMonth);

    const points = revenueData.labels.map((_, index) => {
      const x = padding + (index * (width - padding * 2)) / (revenueData.labels.length - 1);
      const y = height - padding - (revenueData.thisMonth[index] / maxValue) * (height - padding * 2);
      return { x, y };
    });

    const path = points
      .map((pt, index) => `${index === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
      .join(" ");
    const area = `${path} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
    const circles = points
      .map((pt) => `<circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#FFB000" />`)
      .join("");

    container.innerHTML = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Revenue chart">
        <defs>
          <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#FFB000" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#FFB000" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="${area}" fill="url(#revenueGradient)" />
        <path d="${path}" fill="none" stroke="#FFB000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        ${circles}
      </svg>
    `;
  }

  function bindInteractions() {
    const sidebar = document.querySelector(".sidebar");
    const menuToggle = document.querySelector(".menu-toggle");
    const profileButton = document.querySelector(".profile-button");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const logoutButton = document.getElementById("logout-button");

    menuToggle?.addEventListener("click", () => {
      sidebar?.classList.toggle("open");
      document.body.classList.toggle("sidebar-open");
    });

    profileButton?.addEventListener("click", () => {
      if (!dropdownMenu) return;
      const isHidden = dropdownMenu.hasAttribute("hidden");
      if (isHidden) {
        dropdownMenu.removeAttribute("hidden");
        profileButton.setAttribute("aria-expanded", "true");
      } else {
        dropdownMenu.setAttribute("hidden", "");
        profileButton.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", (event) => {
      if (!profileButton?.contains(event.target) && !dropdownMenu?.contains(event.target)) {
        dropdownMenu?.setAttribute("hidden", "");
        profileButton?.setAttribute("aria-expanded", "false");
      }
    });

    logoutButton?.addEventListener("click", async () => {
      try {
        await auth.logout("login.html");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });
  }

  async function initializeDashboard() {
    bindInteractions();

    try {
      const context = await auth.requireAuth("creator");
      if (!context) return;

      const nameElement = document.querySelector("[data-creator-name]");
      const creatorName =
        context.profile?.full_name ||
        context.user?.user_metadata?.full_name ||
        "Creator";

      if (nameElement) {
        nameElement.textContent = creatorName;
      }
    } catch (error) {
      console.error("Unable to load the creator dashboard:", error);
      global.location.replace("login.html");
      return;
    }

    renderStats();
    renderRecentActivity();
    renderCourses();
    renderReviews();
    renderRevenueChart();

    window.addEventListener("resize", renderRevenueChart);
  }

  document.addEventListener("DOMContentLoaded", initializeDashboard);
})(window);
'''

(root / 'creator-dashboard.html').write_text(html, encoding='utf-8')
(root / 'css' / 'dashboard.css').write_text(css, encoding='utf-8')
(root / 'js' / 'creator.js').write_text(js, encoding='utf-8')
print('wrote files', (root / 'creator-dashboard.html').stat().st_size, (root / 'css' / 'dashboard.css').stat().st_size, (root / 'js' / 'creator.js').stat().st_size)
