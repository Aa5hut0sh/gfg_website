import React, { useState } from "react";
import { useNavigate, Link , useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { signup, signupAdmin, googleLogin } from "../services/auth.service"; // Ensure signupAdmin is imported
import { Mail, Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "../auth/authContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
  });
  const { loginUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const from = (location.state as any)?.from || "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {

      let res;
      if (isAdmin) {
        if (!formData.adminSecret) {
          setError("Admin secret is required for administrative registration.");
          return;
        }
        res = await signupAdmin(
          formData.email,
          formData.password,
          formData.adminSecret,
          formData.name
        );
      } else {
        res = await signup(
          formData.email,
          formData.password,
          formData.name
        );
      }

      

      if (res.success) {
        loginUser(res.accessToken, { ...res.user, name: res.user.name || undefined });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please check your credentials.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (isAdmin) {
      setError("Administrative accounts must be created using the official form, not Google.");
      return;
    }

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
      <div className={`w-full max-w-md bg-[#0e0e0e] border ${isAdmin ? 'border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/10'} rounded-2xl p-8 transition-all duration-300`}>
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {isAdmin ? "Admin Registration" : "Create your account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin ? "Authorized access only" : "Sign up to join GFG RGIPT"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Full name"
              className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Admin Toggle */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                className="accent-green-500 h-4 w-4"
                checked={isAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                  setError(""); // Clear error when switching modes
                }}
              />
              Register as admin
            </label>
          </div>

          {/* Admin Secret */}
          {isAdmin && (
            <div className="relative animate-in fade-in slide-in-from-top-2">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />
              <input
                type="password"
                placeholder="Enter Admin Secret Code"
                required={isAdmin}
                className="w-full bg-black border border-green-500/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-2 px-3 rounded-md text-center">
              {error}
            </div>
          )}

          <button className="w-full mt-4 bg-green-600 hover:bg-green-500 text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition active:scale-[0.98]">
            {isAdmin ? "Register Admin" : "Create account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider - Hidden if Admin to discourage OAuth */}
        {!isAdmin && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed")}
                theme="filled_black"
                size="large"
                shape="pill"
              />
            </div>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="text-green-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;