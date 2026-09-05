import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../auth/auth";

const rgiptEmailRegex = /^\d{2}[a-zA-Z]{2}\d{4}@rgipt\.ac\.in$/;

interface AdminLoginProps {
  setMode?: (mode: "login" | "signup") => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!rgiptEmailRegex.test(email))
      return "Admin email must be like 24cs3063@rgipt.ac.in";
    if (!password) return "Password required";
    if (!adminSecret) return "Admin secret required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(email, password, adminSecret);
      console.log("Admin logged in:", res);
      navigate("/realadmin");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[420px] rounded-[28px] p-6 md:p-8">
      {/* Outer glow */}
      <div className="absolute inset-[-20px] rounded-[40px] blur-[120px] bg-green-500/25 -z-10" />

      {/* Card */}
      <div
        className="
          relative rounded-[28px] p-8
          bg-black/60 backdrop-blur-xl
          border border-green-500/40
          shadow-[0_0_60px_rgba(34,197,94,0.35), inset_0_0_25px_rgba(34,197,94,0.2)]
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold tracking-wide mb-1">
            Admin Login
          </h1>
          <p className="text-gray-400 text-sm">
            Secure access for GFG RGIPT admins
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="RGIPT Email (24cs3063@rgipt.ac.in)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full px-5 py-3.5 rounded-full
              bg-black/70 border border-green-500/50
              text-white placeholder-gray-500
              focus:outline-none focus:border-green-400
              focus:shadow-[0_0_25px_rgba(34,197,94,0.7)]
              transition-all
            "
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-5 py-3.5 rounded-full pr-12
                bg-black/70 border border-green-500/50
                text-white placeholder-gray-500
                focus:outline-none focus:border-green-400
                focus:shadow-[0_0_25px_rgba(34,197,94,0.7)]
                transition-all
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 transition"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Admin Secret */}
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              placeholder="Admin Secret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="
                w-full px-5 py-3.5 rounded-full pr-12
                bg-black/70 border border-green-500/50
                text-white placeholder-gray-500
                focus:outline-none focus:border-green-400
                focus:shadow-[0_0_25px_rgba(34,197,94,0.7)]
                transition-all
              "
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 transition"
            >
              {showSecret ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3.5 rounded-full
              bg-gradient-to-r from-green-700 via-green-500 to-green-400
              text-black font-semibold text-lg
              shadow-[0_0_40px_rgba(34,197,94,0.8)]
              hover:shadow-[0_0_70px_rgba(34,197,94,1)]
              hover:scale-[1.03] active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          New admin?{" "}
          <button
            onClick={() => setMode?.("signup")}
            className="text-green-400 hover:text-green-300 hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;