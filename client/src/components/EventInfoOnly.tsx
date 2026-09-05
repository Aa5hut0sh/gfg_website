import { Event } from "../types/event.types";
import { Calendar, Info, Lock } from "lucide-react";
import { Link , useLocation } from "react-router-dom";

const EventInfoOnly = ({ event, message, showLoginPrompt }: { event: Event, message: string, showLoginPrompt?: boolean }) => {
  const location = useLocation();
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700">
      {/* FULL UNCHOPPED IMAGE */}
      <div className="rounded-3xl overflow-hidden border border-white/10 mb-10 shadow-2xl">
        <img src={event.image.url} className="w-full h-auto object-contain bg-black" alt={event.title} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-5xl font-black text-white tracking-tight">{event.title}</h1>
          <div className="flex items-center gap-6 text-gray-400 font-bold text-sm">
            <span className="flex items-center gap-2"><Calendar className="text-green-500" size={18}/> {event.deadline ? new Date(event.deadline).toLocaleDateString() : 'N/A'}</span>
            <span className="bg-white/5 px-4 py-1 rounded-full border border-white/10">{message}</span>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 text-lg leading-relaxed">{event.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl sticky top-24">
            {showLoginPrompt ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="text-green-500" />
                </div>
                <h3 className="text-white font-bold text-xl">Sign in to Join</h3>
                <p className="text-gray-500 text-sm">Registration is open, but you need an account to apply.</p>
                <Link to="/login" state={{ from: location.pathname + location.search }}  className="block w-full py-4 bg-green-600 hover:bg-green-500 text-black font-black rounded-2xl transition-all">
                  LOGIN TO APPLY
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <Info className="text-gray-600 mx-auto mb-4" size={40} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Registration Status</p>
                <p className="text-white mt-2 font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfoOnly;