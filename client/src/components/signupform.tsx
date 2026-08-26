import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { signup, signupAdmin, googleLogin } from "../services/auth.service"; 
import { Mail, Lock, User, ShieldCheck, ArrowRight, KeyRound, RefreshCw } from "lucide-react";
import { useAuth } from "../auth/authContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
    otp: "", 
  });
  
  const { loginUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- NEW COOLDOWN STATES ---
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const location = useLocation();
  const from = (location.state as any)?.from || "/home";

  const handleSendOtp = async () => {
    if (!formData.email) return setError("Please enter your email address first.");
    if (!formData.email.endsWith("@rgipt.ac.in")) return setError("Only institutional emails ending with @rgipt.ac.in are permitted.");

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send verification OTP.");

      setOtpSent(true);
      setSuccessMsg("Verification OTP has been sent securely to your email.");
      setCooldown(30); // Start a 30-second cooldown timer
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    
    try {
      let res: any; 

      if (isAdmin) {
        if (!formData.adminSecret) {
          setError("Admin secret code is required for administrative registration.");
          return;
        }
        res = await signupAdmin(
          formData.email,
          formData.password,
          formData.adminSecret,
          formData.name
        );
      } else {
        if (!formData.otp) {
          setError("OTP verification code is required to create an account.");
          return;
        }
       
        res = await signup(
          formData.email,
          formData.password,
          formData.name,
          formData.otp
        );
      }

      if (res.success) {
        loginUser(res.accessToken, { ...res.user, name: res.user.name || undefined });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please verify your credentials.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (isAdmin) {
      setError("Administrative accounts must be created using the official form, not via Google sign-in.");
      return;
    }
    try {
      if (!credentialResponse?.credential) {
        setError("Google authentication credential is missing.");
        return;
      }
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        loginUser(res.accessToken, { ...res.user, name: res.user.name || undefined });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Google authentication failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className={`w-full max-w-md bg-[#0e0e0e] border ${isAdmin ? 'border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/10'} rounded-2xl p-8 transition-all duration-300`}>
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {isAdmin ? "Admin Registration" : "Create your account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin ? "Authorized personnel access only" : "Sign up to join GFG RGIPT"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Full name"
              required
              className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email Input & Get/Resend OTP Button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            {!isAdmin && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || !formData.email || cooldown > 0}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-black text-sm font-semibold rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {loading ? (
                  "Sending..."
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : otpSent ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                  </>
                ) : (
                  "Get OTP"
                )}
              </button>
            )}
          </div>

          {/* OTP Input - Visible only for Normal User after sending OTP */}
          {!isAdmin && otpSent && (
            <div className="relative animate-in fade-in slide-in-from-top-2">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                required={!isAdmin}
                className="w-full bg-black border border-green-500/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              />
            </div>
          )}

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
                  setError(""); 
                  setSuccessMsg("");
                  setOtpSent(false); 
                  setCooldown(0);
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
          
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs py-2 px-3 rounded-md text-center">
              {successMsg}
            </div>
          )}

          <button 
            type="submit"
            disabled={!isAdmin && !otpSent} 
            className="w-full mt-4 bg-green-600 hover:bg-green-500 text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdmin ? "Register Admin" : "Create account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider & Google Login */}
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
                onError={() => setError("Google authentication failed.")}
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