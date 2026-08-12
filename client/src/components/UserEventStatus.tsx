import { Event } from "../types/event.types";
import { CheckCircle, Calendar, FileText, Hash } from "lucide-react";

const UserEventStatus = ({ event, registration }: { event: Event; registration: any }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
      {/* Success Banner */}
      <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle className="text-green-500 w-5 h-5" />
        <span className="text-green-400 font-semibold text-sm">
          You are successfully registered for this event!
        </span>
      </div>

      <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Event Header with Image */}
        <div className="relative h-64 w-full">
          <img 
            src={event.image.url} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />
          <div className="absolute bottom-6 left-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">{event.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-300 text-sm">
               <span className="flex items-center gap-1.5">
                 <Calendar className="w-4 h-4 text-green-500" /> 
                 {event.deadline ? new Date(event.deadline).toLocaleDateString() : 'TBA'}
               </span>
               <span className="text-gray-600">|</span>
               <span className="flex items-center gap-1.5 text-gray-400">
                 <Hash className="w-4 h-4" /> 
                 ID: {registration._id.slice(-6).toUpperCase()}
               </span>
            </div>
          </div>
        </div>

        {/* Form Details Section */}
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-2 mb-8">
            <FileText className="text-green-500 w-5 h-5" />
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">
              Your Submitted Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {event.fields.map((field) => (
              <div key={field.name} className="group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2 transition-colors group-hover:text-green-500">
                  {field.label}
                </label>
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-gray-200 font-medium transition-all hover:bg-white/[0.05] hover:border-white/10">
                  {Array.isArray(registration.responses[field.name]) ? (
                    <div className="flex flex-wrap gap-2">
                      {registration.responses[field.name].map((val: string, i: number) => (
                        <span key={i} className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs">
                          {val}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="break-words">
                        {registration.responses[field.name] || "Not provided"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs italic">
              Submitted on {new Date(registration.createdAt).toLocaleString()}
            </p>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    GFG RGIPT Official Event
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEventStatus;