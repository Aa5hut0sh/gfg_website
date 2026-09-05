import type { Application } from "../types/application.types";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  ListChecks,
  FileText,
  Info,
  Hash,
  Wrench,
  Users,
} from "lucide-react";

const statusStyles = {
  pending: {
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: Clock,
    label: "Under Review",
    description: "Our team is currently evaluating your application. Hang tight!",
  },
  accepted: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: CheckCircle2,
    label: "Accepted",
    description:
      "Congratulations! You've been selected. Check your email for next steps.",
  },
  rejected: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: XCircle,
    label: "Not Selected",
    description:
      "Thank you for your interest. We unfortunately cannot move forward at this time.",
  },
};

const SubmittedApplication = ({ application }: { application: Application }) => {
  const currentStatus =
    statusStyles[application.status as keyof typeof statusStyles] ||
    statusStyles.pending;

  const StatusIcon = currentStatus.icon;

  return (
    <div className="max-w-2xl mx-auto mt-25 animate-in fade-in zoom-in duration-300">
      {/* Status Banner */}
      <div
        className={`mb-6 rounded-2xl border ${currentStatus.border} ${currentStatus.bg} p-6 flex items-center gap-4`}
      >
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center ${currentStatus.bg} border ${currentStatus.border}`}
        >
          <StatusIcon className={`w-6 h-6 ${currentStatus.color}`} />
        </div>
        <div>
          <h2 className={`text-lg font-bold ${currentStatus.color}`}>
            Application {currentStatus.label}
          </h2>
          <p className="text-sm text-gray-400">
            {currentStatus.description}
          </p>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-white">
              Application Details
            </h1>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
              ID: {application._id.slice(-6)}
            </span>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Roll No */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Hash className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Roll No
                </span>
              </div>
              <p className="text-white font-medium uppercase">
                {application.rollNo}
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Phone className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Contact
                </span>
              </div>
              <p className="text-white font-medium">
                {application.MobileNo}
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Info className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Current Status
                </span>
              </div>
              <p
                className={`${currentStatus.color} font-medium capitalize`}
              >
                {application.status}
              </p>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-500">
              <ListChecks className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Team Preferences
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[application.preference1, application.preference2, application.preference3].map(
                (pref, i) => (
                  <div
                    key={i}
                    className="bg-black border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-300"
                  >
                    <span className="text-green-500 mr-2 font-bold">
                      {i + 1}.
                    </span>{" "}
                    {pref}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-500">
              <Wrench className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Skills
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {application.skills?.length ? (
                application.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-gray-300"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic text-sm">
                  No skills provided
                </span>
              )}
            </div>
          </div>

          {/* Other Clubs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Other Clubs / Socities
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {application.OtherClubs?.length ? (
                application.OtherClubs.map((club, i) => (
                  <span
                    key={i}
                    className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-gray-300"
                  >
                    {club}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic text-sm">
                  None
                </span>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-gray-500">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Statement of Purpose
              </span>
            </div>
            <div className="bg-black/50 border border-white/5 rounded-2xl p-4 text-gray-400 text-sm leading-relaxed italic">
              "{application.reason}"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.02] py-4 px-8 border-t border-white/5 flex justify-between items-center">
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
            GFG RGIPT Student Chapter
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-green-500/50" />
            <div className="w-1 h-1 rounded-full bg-green-500/30" />
            <div className="w-1 h-1 rounded-full bg-green-500/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedApplication;
