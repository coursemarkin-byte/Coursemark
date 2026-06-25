(function initializeCourseMarkSupabase(global) {
  "use strict";

  const SUPABASE_URL = "https://foxnhxtpvwvqnkwcegje.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZveG5oeHRwdnd2cW5rd2NlZ2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDgxNTUsImV4cCI6MjA5Nzg4NDE1NX0.WrjYZzLhq5z41pFYhfdQ_yJQMxfUrAV-8PgU0ENZPEk";

  const supabaseClient = global.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: "coursemark-auth",
        storage: global.localStorage,
        autoRefreshToken: true,
      },
    },
  );

  global.CourseMarkConfig = Object.freeze({
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    supabaseClient,
  });
})(window);
