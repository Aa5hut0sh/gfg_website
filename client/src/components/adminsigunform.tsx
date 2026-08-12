import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignup } from "../auth/auth";

const rgiptEmailRegex = /^\d{2}[a-zA-Z]{2}\d{4}@rgipt\.ac\.in$/;
const passwordChecks = {
  length: (s: string) => s.length >= 6,
  uppercase: (s: string) => /[A-Z]/.test(s),
  number: (s: string) => /[0-9]/.test(s),
  special: (s: string) => /[^A-Za-z0-9]/.test(s),
};

interface AdminSignupFormProps {
  setMode?: (mode: "login" | "signup") => void;
}

const AdminSignupForm: React.FC<AdminSignupFormProps> = ({ setMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!rgiptEmailRegex.test(email))
      return "Email must be like 24cs3063@rgipt.ac.in";
    if (!passwordChecks.length(password))
      return "Password must be at least 6 characters";
    if (!passwordChecks.uppercase(password))
      return "Password must contain one uppercase letter";
    if (!passwordChecks.number(password))
      return "Password must contain one number";
    if (!passwordChecks.special(password))
      return "Password must contain one special character";
    if (!adminSecret.trim()) return "Admin secret is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const v = validate();
    if (v) {
      setMessage(v);
      return;
    }

    setLoading(true);
    try {
      const data = await adminSignup(name, email, password, adminSecret);

      if (data?.admin?.email) {
        setMessage(`Admin signed up successfully: ${data.admin.email}`);
      } else {
        setMessage(data?.message || "Admin signed up successfully");
      }

      setName("");
      setEmail("");
      setPassword("");
      setAdminSecret("");

      // Switch to login tab + route
      setMode && setMode("login");
    } catch (err: any) {
      setMessage(err?.message || "Admin signup failed");
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
            Admin Signup
          </h1>
          <p className="text-gray-400 text-sm">
            Create an admin account for GFG RGIPT
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full px-5 py-3.5 rounded-full
              bg-black/70 border border-green-500/50
              text-white placeholder-gray-500
              focus:outline-none focus:border-green-400
              focus:shadow-[0_0_25px_rgba(34,197,94,0.7)]
              transition-all
            "
          />

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

          <input
            type="password"
            placeholder="Strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-5 py-3.5 rounded-full
              bg-black/70 border border-green-500/50
              text-white placeholder-gray-500
              focus:outline-none focus:border-green-400
              focus:shadow-[0_0_25px_rgba(34,197,94,0.7)]
              transition-all
            "
          />

          <input
            type="password"
            placeholder="Admin secret"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            className="
              w-full px-5 py-3.5 rounded-full
              bg-black/70 border border-green-500/50
              text-white placeholder-gray-500
              focus:outline-none focus:border-green-400
              focus:shadow-[0_0_25px_rgba(34,197,94,0.7)]
              transition-all
            "
          />

          {message && (
            <p
              className={`text-center text-sm ${
                message.includes("successfully")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

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
            {loading ? "Signing up..." : "Signup as Admin"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already an admin?{" "}
          <button
            onClick={() => setMode?.("login")}
            className="text-green-400 hover:text-green-300 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminSignupForm;