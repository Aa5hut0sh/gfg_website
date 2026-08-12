const pastEvents = [
  {
    id: "3",
    title: "Code Quest",
    date: "Dec 2025",
    venue: "RGIPT Campus",
    description: "Competitive coding contest with IIT Bombay Techfest passes.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
  },
  {
    id: "4",
    title: "DataViz 2.0",
    date: "Oct 2025",
    venue: "Online",
    description: "Data visualization challenge with 40+ teams.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  },
];

const PastEvents = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">
         Past <span className="text-green-400">Events</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pastEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition"
          >
            <img
              src={event.image}
              alt={event.title}
              className="h-44 w-full object-cover opacity-80"
            />

            <div className="p-5 space-y-2">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-400">
                {event.date} • {event.venue}
              </p>
              <p className="text-sm text-gray-500">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastEvents;