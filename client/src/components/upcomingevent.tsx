import { FiCalendar, FiMapPin, FiExternalLink } from "react-icons/fi";

const upcomingEvents = [
  {
    id: "1",
    title: "Graph Programming Camp",
    date: "Feb 7–9, 2026",
    venue: "Online",
    description: "3-day hands-on graph programming bootcamp by Codeforces Master.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    link: "#",
  },
  {
    id: "2",
    title: "AI & ML Workshop",
    date: "Mar 12, 2026",
    venue: "RGIPT Auditorium",
    description: "Practical workshop on ML models & real-world use cases.",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b",
  },
];

const UpcomingEvents = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">
         Upcoming <span className="text-green-400">Events</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="group rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:scale-[1.02] transition"
          >
            <img
              src={event.image}
              alt={event.title}
              className="h-56 w-full object-cover opacity-80 group-hover:opacity-100 transition"
            />

            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold">{event.title}</h3>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <FiCalendar /> {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <FiMapPin /> {event.venue}
                </span>
              </div>

              <p className="text-gray-400">{event.description}</p>

              {event.link && (
                <a
                  href={event.link}
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition"
                >
                  Register <FiExternalLink />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;