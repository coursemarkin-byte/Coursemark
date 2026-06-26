// js/nav.js — Add to every page that has a nav
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) return;

  const {
    data: { user },
  } = await window.supabaseClient.auth.getUser();
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  if (user) {
    const { data: profile } = await window.supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const name = profile?.full_name?.split(" ")[0] || "My Account";

    navActions.innerHTML = `
      <a href="student-dashboard.html" class="login-btn">👋 ${name}</a>
      <button onclick="handleLogout()" style="background:none;border:none;
        cursor:pointer;font-size:14px;color:#718096;padding:8px 12px">
        Logout
      </button>`;
  }
});

async function handleLogout() {
  await window.supabaseClient.auth.signOut();
  window.location.replace("login.html");
}
