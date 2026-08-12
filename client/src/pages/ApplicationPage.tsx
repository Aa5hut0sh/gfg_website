import { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import { Link , useLocation } from "react-router-dom"; // Import Link for buttons
import { Lock } from "lucide-react"; // Import a lock icon
import {
  getAllApplications,
  getFilledApplication,
} from "../services/application.service";
import type { Application } from "../types/application.types";
import AdminApplications from "../components/AdminApplications";
import ApplicationForm from "../components/ApplicationForm";
import SubmittedApplication from "../components/SubmittedApplications";

const ApplicationPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const location = useLocation();
  useEffect(() => {
    const fetchData = async () => {

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        if (user.role === "ADMIN") {
          const res = await getAllApplications();
          setAllApplications(res.forms || []);
        } else {
          const res = await getFilledApplication();
          setApplication(res.application);
        }
      } catch {
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  // 1. Case: Admin logged in
  if (user?.role === "ADMIN") {
    return <AdminApplications applications={allApplications} />;
  }

  // 2. Case: User logged in and has submitted
  if (user && application) {
    return <SubmittedApplication application={application} />;
  }

  // 3. Case: Not logged in OR hasn't submitted yet
  return (
    <div className="relative min-h-screen">
      {/* The Form (Blurred if no user) */}
      <div className={`${!user ? "blur-md pointer-events-none select-none" : ""}`}>
        <ApplicationForm onSubmitted={setApplication} />
      </div>

      {/* The Auth Guard Overlay (Only visible if no user) */}
      {!user && (
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-[#0f0f0f] border border-white/10 p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="text-green-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
            <p className="text-gray-400 mb-8 text-sm">
              Please sign in to your account to fill out the application form and join GFG RGIPT.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/login" 
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-black font-bold rounded-xl transition-all"
              >
                Login to Account
              </Link>
              <Link
                to="/signup" state={{ from: location.pathname + location.search }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationPage;