import React, { useState } from "react";
import { useNavigate, Link,useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { login, googleLogin } from "../services/auth.service";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/authContext";
const LoginForm = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const from = (location.state as any)?.from || "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        loginUser(res.accessToken, { ...res.user, name: res.user.name || undefined });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse?.credential) {
        setError("Google credential missing");
        return;
      }

      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        loginUser(res.accessToken, { ...res.user, name: res.user.name || undefined });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0e0e0e] border border-white/10 rounded-2xl p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Sign in to your account
          </h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          {/* Submit */}
          <button
            disabled={isLoading}
            className="w-full mt-4 bg-green-600 hover:bg-green-500 text-black font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            theme="filled_black"
            shape="pill"
            text="signin_with"
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" state={location.state} className="text-green-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
