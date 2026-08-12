import { useState, useEffect } from "react";
import {
  updateApplicationStatus,
  exportApplicationsToExcel,
} from "../services/application.service";
import type {
  Application,
  ApplicationStatus,
} from "../types/application.types";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ListChecks,
  ChevronDown,
  Phone,
  Wrench,
  Users,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";

const statusConfig = {
  pending: {
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: Clock,
  },
  accepted: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: CheckCircle2,
  },
  rejected: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: XCircle,
  },
};

const AdminApplications = ({
  applications,
}: {
  applications: Application[];
}) => {
  const [data, setData] = useState<Application[]>(applications);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setData(applications);
  }, [applications]);

  const handleStatusChange = async (
    userId: string,
    status: ApplicationStatus,
  ) => {
    if (updatingUser === userId) return;
    setUpdatingUser(userId);
    try {
      const res: any = await updateApplicationStatus({
        userId,
        newStatus: status,
      });
      const updatedForm = res.form;

      setData((prev) =>
        prev.map((app) =>
          app.user._id === userId
            ? { ...app, status: updatedForm.status }
            : app,
        ),
      );
      toast.success(`Status updated to ${status}`);
    } catch (error: any) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingUser(null);
    }
  };

  return (
    <div className="min-h-screen mt-25  p-4 md:p-8 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Application Management
            </h1>
            <p className="text-gray-500 mt-2">
              Review and manage member applications for GFG RGIPT.
            </p>
          </div>
          <button
            onClick={async () => {
              setExporting(true);
              try {
                await exportApplicationsToExcel();
                toast.success("Applications exported successfully");
              } catch {
                toast.error("Failed to export applications");
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors duration-200 self-start md:self-center"
          >
            {exporting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
        </header>

        <div className="grid gap-6">
          {data.map((app) => {
            const statusMeta =
              statusConfig[app.status as keyof typeof statusConfig];
            const StatusIcon = statusMeta.icon;
            const isExpanded = expandedId === app._id;

            return (
              <div
                key={app._id}
                className={`group relative bg-[#0e0e0e] border ${
                  isExpanded
                    ? "border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.05)]"
                    : "border-white/10"
                } rounded-2xl p-6 transition-all duration-300 hover:border-white/20`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Left: Basic Info */}
                  <div
                    className="flex items-start gap-4 cursor-pointer flex-1"
                    onClick={() => setExpandedId(isExpanded ? null : app._id)}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/20">
                      <User className="w-6 h-6 text-green-500" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {app.user.name} | {app.rollNo}
                        <span
                          className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
                        >
                          {app.status}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {app.MobileNo}
                        </span>
                        <span className="flex items-center gap-1">
                          <ListChecks className="w-3 h-3" /> {app.preference1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex bg-black border border-white/10 p-1 rounded-xl">
                      {(
                        [
                          "pending",
                          "accepted",
                          "rejected",
                        ] as ApplicationStatus[]
                      ).map((s) => (
                        <button
                          key={s}
                          disabled={
                            updatingUser === app.user._id || app.status === s
                          }
                          onClick={() => handleStatusChange(app.user._id, s)}
                          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 capitalize
                            ${app.status === s ? "bg-white/10 text-white shadow-inner" : "text-gray-500 hover:text-white hover:bg-white/5"}
                            ${updatingUser === app.user._id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-6">
                      {/* Skills Section */}
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                          <Wrench className="w-3 h-3" /> Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {app.skills?.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Other Clubs */}
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                          <Users className="w-3 h-3" /> Other Club / Society
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {app.OtherClubs?.length ? (
                            app.OtherClubs.map((club, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400"
                              >
                                {club}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-600 italic">
                              No other clubs mentioned
                            </span>
                          )}
                        </div>
                      </div>

                      {/* All Preferences */}
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                          <ListChecks className="w-3 h-3" /> Team Preferences
                        </label>
                        <ol className="text-sm text-gray-400 space-y-1">
                          <li>1. {app.preference1}</li>
                          <li>2. {app.preference2}</li>
                          <li>3. {app.preference3}</li>
                        </ol>
                      </div>
                    </div>

                    {/* SOP / Reason Section */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                        <FileText className="w-3 h-3" /> Reason to join
                      </label>
                      <p className="text-sm text-gray-300 leading-relaxed italic">
                        "{app.reason}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading Overlay */}
                {updatingUser === app.user._id && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-green-500 font-medium">
                      <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
