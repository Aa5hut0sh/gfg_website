
import { googleLogin } from "../auth/auth";
import { useAuth } from "../auth/authContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// replace this with Firebase / Google SDK
const getGoogleToken = async () => {
  return "GOOGLE_ID_TOKEN";
};

const GoogleButton = () => {
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const googleToken = await getGoogleToken();
      const res = await googleLogin(googleToken);
      if (res.accessToken && res.user) {
        loginUser(res.accessToken, res.user);
        navigate("/home");
      }
    } catch (err: any) {
      setError(err?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin} disabled={loading}>
        {loading ? "Continuing..." : "Continue with Google"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default GoogleButton;
