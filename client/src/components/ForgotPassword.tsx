import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // UI States
  const [step, setStep] = useState<1 | 2>(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Cooldown State for Resend OTP
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

  
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Please enter your registered email address.");

    setLoading(true);
    setError("");
    setSuccessMsg("");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send password reset OTP.");

      setSuccessMsg("Password reset OTP has been sent securely to your email.");
      setStep(2); 
      setCooldown(30); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return setError("Both OTP and new password fields are required.");

    setLoading(true);
    setError("");
    setSuccessMsg("");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to reset password.");

      setSuccessMsg("Password successfully reset! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden -z-10">
        <div className="w-full max-w-lg h-96 bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md bg-[#0e0e0e] border border-white/10 rounded-2xl p-8 shadow-2xl transition-all duration-300">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1 ? "Enter your email to receive a reset code" : "Create a new secure password"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="space-y-4">
          
          {}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                placeholder="Registered Email address"
                required
                disabled={step === 2}
                className={`w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none ${step === 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {}
            {step === 2 && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || cooldown > 0}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-black text-sm font-semibold rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {loading ? (
                  "Sending..."
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" /> Resend
                  </>
                )}
              </button>
            )}
          </div>

          {}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  required
                  className="w-full bg-black border border-green-500/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-green-500 outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Error & Success Messages */}
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

          {/* Submit Button */}
          {step === 1 && (
            <button 
              type="submit"
              disabled={loading || cooldown > 0} 
              className="w-full mt-4 bg-green-600 hover:bg-green-500 text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Send Reset OTP"}
              {!loading && cooldown === 0 && <ArrowRight className="w-4 h-4" />}
            </button>
          )}

          {step === 2 && (
            <button 
              type="submit"
              disabled={loading} 
              className="w-full mt-4 bg-green-600 hover:bg-green-500 text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Reset Password"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          )}
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 flex justify-center">
          <Link 
            to="/login" 
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-green-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;