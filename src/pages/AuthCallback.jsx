import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // onAuthStateChange catches the SIGNED_IN event fired when Supabase
    // exchanges the OAuth code/token from the URL hash into a real session.
    // getSession() alone runs too early before that exchange completes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          const role = session.user?.user_metadata?.role;

          if (role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            const redirect = localStorage.getItem("redirectAfterLogin") || "/dashboard";
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirect, { replace: true });
          }
        }
      }
    );

    // Fallback: if session already exists (e.g. page refresh), navigate immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        const role = session.user?.user_metadata?.role;
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          const redirect = localStorage.getItem("redirectAfterLogin") || "/dashboard";
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirect, { replace: true });
        }
      }
    });

    // Safety timeout — if nothing happens in 5s, go to login
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      navigate("/login", { replace: true });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#05051a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      gap: "16px"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid #a855f7",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "#9ca3af", fontSize: "14px" }}>Signing you in...</p>
    </div>
  );
}