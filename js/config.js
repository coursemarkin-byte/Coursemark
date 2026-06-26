// CourseMark Config
const SUPABASE_URL = "https://foxnhxtpvwvqnkwcegje.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZveG5oeHRwdnd2cW5rd2NlZ2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDgxNTUsImV4cCI6MjA5Nzg4NDE1NX0.WrjYZzLhq5z41pFYhfdQ_yJQMxfUrAV-8PgU0ENZPEk";

const _client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: "coursemark-auth",
    storage: window.localStorage,
    autoRefreshToken: true,
  },
});

// Both naming conventions — fixes auth.js and admin pages
window.supabaseClient = _client;
window.CourseMarkConfig = { supabaseClient: _client };

// Utils — fixes login.js
window.CourseMarkUtils = {
  showMessage(el, msg, type = "error") {
    if (!el) return;
    el.textContent = msg;
    el.style.color =
      type === "success"
        ? "#38a169"
        : type === "warning"
          ? "#b45309"
          : "#e53e3e";
  },
  clearMessage(el) {
    if (el) el.textContent = "";
  },
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  setButtonLoading(btn, loading, label = "") {
    if (!btn) return;
    btn.disabled = loading;
    if (label) btn.textContent = label;
  },
  getFriendlyAuthError(error) {
    const msg = (error?.message || "").toLowerCase();
    if (msg.includes("invalid login") || msg.includes("invalid credentials"))
      return "Incorrect email or password.";
    if (msg.includes("email not confirmed"))
      return "Please confirm your email first.";
    if (msg.includes("rate limit") || msg.includes("too many"))
      return "Too many attempts. Please wait.";
    if (msg.includes("user not found"))
      return "No account found with this email.";
    return error?.message || "Something went wrong. Please try again.";
  },
};

// Toast for admin pages
window.showToast = function (message, type = "success") {
  let toast = document.getElementById("cm-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cm-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "toast " + type + " show";
  setTimeout(() => {
    toast.className = "toast " + type;
  }, 3000);
};

// Admin auth check
window.requireAdmin = async function () {
  const {
    data: { user },
  } = await _client.auth.getUser();
  if (!user) {
    window.location.href = "../login.html";
    return null;
  }
  const { data: profile } = await _client
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    window.location.href = "../index.html";
    return null;
  }
  const nameEl = document.querySelector("[data-admin-name]");
  const avatarEl = document.querySelector("[data-admin-avatar]");
  if (nameEl) nameEl.textContent = profile.full_name || "Administrator";
  if (avatarEl && profile.avatar_url) avatarEl.src = profile.avatar_url;
  return profile;
};

window.logoutAdmin = async function () {
  await _client.auth.signOut();
  window.location.href = "../login.html";
};
