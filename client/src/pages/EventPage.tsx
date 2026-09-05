import { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import { getAllEvents } from "../services/event.service"; // Use getAllEvents for everyone now
import { Event } from "../types/event.types";
import { Plus, Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.events);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const now = new Date();

  const currentEvents = events.filter((e) => {
    if (!e.deadline) return true;
    return new Date(e.deadline) > now;
  });
  const pastEvents = events.filter((e) => {
    if (!e.deadline) return false;
    return new Date(e.deadline) <= now;
  });

  if (loading)
    return (
      <div className="text-white p-20 text-center animate-pulse">
        Loading Events...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            EVENTS
          </h1>
          <p className="text-gray-500 mt-2">
            Discover what's happening at GFG RGIPT.
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <Link
            to="/events/create"
            className="bg-green-600 hover:bg-green-500 text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-green-900/20"
          >
            <Plus size={20} /> CREATE EVENT
          </Link>
        )}
      </div>

      {/* Current Events Section */}
      <section className="mb-24">
        <h2 className="text-xs font-black text-green-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
          Active & Upcoming <div className="h-px flex-1 bg-green-500/20"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <EventGridCard key={event._id} event={event} isPast={false} />
            ))
          ) : (
            <p className="text-gray-600 italic">
              No upcoming events at the moment.
            </p>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section>
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
          Past Memories <div className="h-px flex-1 bg-white/10"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 opacity-70">
          {pastEvents.map((event) => (
            <EventGridCard key={event._id} event={event} isPast={true} />
          ))}
        </div>
      </section>
    </div>
  );
};

const EventGridCard = ({
  event,
  isPast,
}: {
  event: Event;
  isPast: boolean;
}) => (
  <Link
    to={`/events/${event._id}`}
    className="group bg-[#0e0e0e] border border-white/5 rounded-3xl overflow-hidden hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2"
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={event.image.url}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {isPast && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="border border-white/40 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
            Completed
          </span>
        </div>
      )}
    </div>
    <div className="p-8">
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-500 transition-colors">
        {event.title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
        {event.description}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
          <Calendar size={14} className="text-green-500" />
          {event.deadline
            ? new Date(event.deadline).toLocaleDateString()
            : "TBA"}
        </div>
        <ArrowRight
          size={18}
          className="text-gray-700 group-hover:text-green-500 transition-all"
        />
      </div>
    </div>
  </Link>
);

export default EventsPage;
