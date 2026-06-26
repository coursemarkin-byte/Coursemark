document.addEventListener("DOMContentLoaded", async () => {
  const sb = window.supabaseClient;
  const grid = document.querySelector(".course-grid");
  if (!grid) return;

  // Show loading
  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#718096">Loading courses...</div>`;

  // Load published courses from Supabase
  const { data: courses, error } = await sb
    .from("courses")
    .select("*, profiles(full_name)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#e53e3e">Failed to load courses. Please try again.</div>`;
    console.error("Courses load error:", error);
    return;
  }

  if (!courses || courses.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px 24px">
        <div style="font-size:48px;margin-bottom:12px">🎓</div>
        <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">No courses yet</h3>
        <p style="color:#718096">Courses will appear here once creators publish them.</p>
      </div>`;
    return;
  }

  // Render courses
  window._allCourses = courses;
  renderCourses(courses);

  // Search
  const searchForm = document.querySelector(".page-search");
  const searchInput = searchForm?.querySelector('input[type="search"]');

  searchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilter(searchInput?.value || "", window._activeFilter || "All");
  });

  searchInput?.addEventListener("input", (e) => {
    applyFilter(e.target.value, window._activeFilter || "All");
  });

  // Filter buttons
  const filterButtons = document.querySelectorAll(".course-filters button");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      window._activeFilter = btn.textContent.trim();
      applyFilter(searchInput?.value || "", window._activeFilter);
    });
  });
});

function applyFilter(query, filter) {
  const all = window._allCourses || [];
  const q = query.trim().toLowerCase();

  const filtered = all.filter((course) => {
    const matchesQuery =
      !q ||
      (course.title || "").toLowerCase().includes(q) ||
      (course.category || "").toLowerCase().includes(q) ||
      (course.profiles?.full_name || "").toLowerCase().includes(q);

    const matchesFilter =
      !filter ||
      filter === "All" ||
      (filter === "Under Rs. 1000" && course.price < 1000) ||
      (filter === "Beginner" &&
        (course.level || "").toLowerCase() === "beginner") ||
      (filter === "Intermediate" &&
        (course.level || "").toLowerCase() === "intermediate") ||
      (filter === "Certificate" && course.has_certificate);

    return matchesQuery && matchesFilter;
  });

  renderCourses(filtered);
}

function renderCourses(courses) {
  const grid = document.querySelector(".course-grid");
  if (!grid) return;

  if (!courses || courses.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px 24px">
        <div style="font-size:40px;margin-bottom:12px">🔍</div>
        <p style="color:#718096">No courses match your search.</p>
      </div>`;
    return;
  }

  grid.innerHTML = courses
    .map(
      (course) => `
    <div class="course-card">
      <span class="badge">${course.category || "Course"}</span>
      ${
        course.thumbnail_url
          ? `<img src="${course.thumbnail_url}" alt="${course.title}" style="width:100%;height:180px;object-fit:cover">`
          : `<div style="width:100%;height:180px;background:linear-gradient(135deg,#f5a623,#d4881a);display:flex;align-items:center;justify-content:center;font-size:48px">🎓</div>`
      }
      <h3>${course.title || "Untitled"}</h3>
      <p>${course.profiles?.full_name || "CourseMark Creator"}</p>
      <p>${course.description ? course.description.substring(0, 80) + "..." : ""}</p>
      <div class="course-meta">
        <span>${course.level || "All levels"}</span>
        ${course.has_certificate ? "<span>Certificate</span>" : ""}
      </div>
      <h4>Rs. ${course.price || "Free"}</h4>
      <a href="course-details.html?id=${course.id}" class="card-action">See Course</a>
    </div>
  `,
    )
    .join("");
}
