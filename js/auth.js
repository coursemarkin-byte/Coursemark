(function initializeCourseMarkAuth(global) {
  "use strict";

  const client = global.CourseMarkConfig?.supabaseClient;
  if (!client) {
    throw new Error(
      "Supabase client is not initialized. Load js/config.js first.",
    );
  }

  async function login(email, password) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data?.session?.user) {
      throw new Error("Login succeeded but no active session was returned.");
    }

    global.currentUser = data.session.user;
    return data;
  }

  async function signup({ fullName, email, password, role }) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
        emailRedirectTo: new URL("login.html", global.location.href).href,
      },
    });

    if (error) throw error;
    if (!data?.user) {
      throw new Error("Supabase did not return a new user.");
    }

    return data;
  }

  async function logout(redirectTo = "login.html") {
    const { error } = await client.auth.signOut();
    if (error) throw error;

    global.currentUser = null;
    if (redirectTo) {
      global.location.replace(redirectTo);
    }
  }

  async function getCurrentUser() {
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error) {
      if (error.name === "AuthSessionMissingError") {
        return null;
      }
      throw error;
    }

    global.currentUser = user || null;
    return user || null;
  }

  async function getProfile(userId) {
    const id = userId || (await getCurrentUser())?.id;
    if (!id) {
      return null;
    }

    const { data, error } = await client
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  }

  function getUserRole(profile, user) {
    return profile?.role || user?.user_metadata?.role || null;
  }

  async function requireAuth(requiredRole) {
    const user = await getCurrentUser();
    if (!user) {
      global.location.replace("login.html");
      return null;
    }

    const profile = await getProfile(user.id);
    const role = getUserRole(profile, user);

    if (requiredRole && role !== requiredRole) {
      await redirectByRole(profile, user);
      return null;
    }

    return { user, profile, role };
  }

  async function redirectByRole(profile, user) {
    const activeUser = user || (await getCurrentUser());

    if (!activeUser) {
      global.location.replace("login.html");
      return;
    }

    const activeProfile = profile || (await getProfile(activeUser.id));
    const role = getUserRole(activeProfile, activeUser);

    switch (role) {
      case "admin":
        global.location.replace("admin/index.html");
        break;

      case "creator":
        global.location.replace("creator-dashboard.html");
        break;

      case "student":
        global.location.replace("student-dashboard.html");
        break;

      default:
        global.location.replace("login.html");
        break;
    }
  }

  async function resetPassword(email) {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: new URL("login.html", global.location.href).href,
    });

    if (error) throw error;
  }

  async function loginWithGoogle() {
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: new URL("login.html", global.location.href).href,
      },
    });

    if (error) throw error;
  }

  function onAuthStateChange(callback) {
    return client.auth.onAuthStateChange((_event, session) => {
      global.currentUser = session?.user || null;
      callback(session);
    });
  }

  global.CourseMarkAuth = Object.freeze({
    login,
    signup,
    logout,
    getCurrentUser,
    getProfile,
    getUserRole,
    requireAuth,
    redirectByRole,
    resetPassword,
    loginWithGoogle,
    onAuthStateChange,
  });
})(window);
