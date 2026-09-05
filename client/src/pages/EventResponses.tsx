import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById, getEventResponses } from "../services/event.service";
import { Event, EventRegistration } from "../types/event.types";
import { Download, User, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const EventResponses = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [responses, setResponses] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [eventRes, responsesRes] = await Promise.all([
          getEventById(id),
          getEventResponses(id)
        ]);
        setEvent(eventRes.event);
        setResponses(responsesRes.responses);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Utility to export to CSV
  const exportToCSV = () => {
    if (!event || !responses.length) return;
    
    const headers = ["Registration Date", ...event.fields.map(f => f.label)];
    const rows = responses.map(r => [
      new Date(r.createdAt).toLocaleDateString(),
      ...event.fields.map(f => r.responses[f.name] || "N/A")
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title}_Responses.csv`;
    link.click();
  };

  if (loading) return <div className="text-white p-20">Loading responses...</div>;
  if (!event) return <div className="text-white p-20">Event not found.</div>;

  return (
    <div className="max-w-7xl mx-auto py-24 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <Link to="/events" className="text-green-500 flex items-center gap-2 text-sm mb-2 hover:underline">
            <ArrowLeft size={16} /> Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          <p className="text-gray-400 text-sm">Total Registrations: {responses.length}</p>
        </div>
        
        <button 
          onClick={exportToCSV}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Download size={20} /> Export CSV
        </button>
      </div>

      <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-hidden overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/10">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User Details</th>
              {event.fields.map((field) => (
                <th key={field.name} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {field.label}
                </th>
              ))}
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {responses.map((res) => (
              <tr key={res._id} className="hover:bg-white/[0.01] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <User size={14} className="text-green-500" />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{res.user.slice(-6)}</span>
                  </div>
                </td>
                
                {event.fields.map((field) => (
                  <td key={field.name} className="p-4 text-sm text-gray-300">
                    {Array.isArray(res.responses[field.name]) 
                      ? res.responses[field.name].join(", ") 
                      : res.responses[field.name] || <span className="text-gray-600">—</span>}
                  </td>
                ))}

                <td className="p-4 text-right text-xs text-gray-500 font-medium">
                  {new Date(res.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {responses.length === 0 && (
          <div className="py-20 text-center text-gray-500 italic">
            No registrations yet for this event.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventResponses;