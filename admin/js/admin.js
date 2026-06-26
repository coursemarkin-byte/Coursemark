const supabaseClient = window.supabaseClient;

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Admin.js loaded");

  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    console.log("User:", user);
    console.log("User Error:", userError);

    if (!user) {
      console.log("No logged in user");
      window.location.href = "../login.html";
      return;
    }

    const { data: profile, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("Profile:", profile);
    console.log("Profile Error:", error);

    if (error) {
      return;
    }

    if (profile.role !== "admin") {
      console.log("User is not admin");
      window.location.href = "../index.html";
      return;
    }

    console.log("Admin access granted");

    // Set admin name
    document.querySelector("[data-admin-name]").textContent =
      profile.full_name || "Administrator";

    // Set admin avatar
    const adminAvatar = document.querySelector("[data-admin-avatar]");

    if (adminAvatar) {
      adminAvatar.src =
        profile.avatar_url || "../assets/images/default-avatar.png";
    }

    // Load dashboard statistics
    await loadPendingCount();
    await loadPublishedCount();
    await loadCreatorCount();
    await loadStudentCount();
  } catch (err) {
    console.error("Unexpected Error:", err);
  }
});
// Pending Review Courses
async function loadPendingCount() {
  const { count, error } = await supabaseClient
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_review");

  if (!error) {
    document.getElementById("pending-count").textContent = count;
  }
}

//Published Courses
async function loadPublishedCount() {
  const { count, error } = await supabaseClient
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  if (!error) {
    document.getElementById("published-count").textContent = count;
  }
}
//total creators 
async function loadCreatorCount() {
  const { count, error } = await supabaseClient
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "creator");

  if (!error) {
    document.getElementById("creator-count").textContent = count;
  }
}
//total students
async function loadStudentCount() {
  const { count, error } = await supabaseClient
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  if (!error) {
    document.getElementById("student-count").textContent = count;
  }
}
async function logoutAdmin() {
  await supabaseClient.auth.signOut();
  window.location.href = "../login.html";
}
