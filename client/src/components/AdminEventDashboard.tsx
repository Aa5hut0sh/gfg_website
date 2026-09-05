import { useNavigate } from "react-router-dom";
import { Event, EventField, FieldType } from "../types/event.types";
import { updateEvent , deleteEvent } from "../services/event.service";
import {
  Users,
  Edit,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Eye,
  Save,
  X,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";

const AdminEventDashboard = ({
  event,
  refreshEvent,
}: {
  event: Event;
  refreshEvent: () => void;
}) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // Initialize form state
  const [editForm, setEditForm] = useState({
    title: event.title,
    description: event.description,
    deadline: event.deadline
      ? new Date(event.deadline).toISOString().slice(0, 16)
      : "",
    isActive: event.isActive,
    fields: [...event.fields],
  });

  const handleDeleteEvent = async ()=>{
    try{
      await deleteEvent(event._id);
      navigate(`/events`);
      toast.success("Event Deleted");
    }catch{
      toast.error("Deletion failed");
    }
    
  }

  
  const handleToggleStatus = async () => {
    const newStatus = !event.isActive;
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("isActive", String(newStatus));
      
      // We send existing data to satisfy backend requirements if necessary
      formData.append("title", event.title);
      formData.append("description", event.description);
      formData.append("fields", JSON.stringify(event.fields));

      await updateEvent(event._id, formData);
      toast.success(newStatus ? "Event is now Live!" : "Event deactivated");
      refreshEvent();
    } catch (err: any) {
      toast.error("Status update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * FULL UPDATE: Handles the entire form submission
   */
  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("isActive", String(editForm.isActive));
      formData.append("fields", JSON.stringify(editForm.fields));

      if (editForm.deadline) {
        formData.append("deadline", new Date(editForm.deadline).toISOString());
      }

      await updateEvent(event._id, formData);
      toast.success("Event updated successfully");
      setShowEditor(false);
      refreshEvent();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const addField = () => {
    const newField: EventField = {
      label: "",
      name: `field_${Date.now()}`,
      type: "text",
      required: false,
    };
    setEditForm({ ...editForm, fields: [...editForm.fields, newField] });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-8">
        <div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block ${
              event.isActive
                ? "bg-green-500/20 text-green-500"
                : "bg-yellow-500/20 text-yellow-500"
            }`}
          >
            {event.isActive ? "Live" : "Draft Mode"}
          </span>
          <h1 className="text-4xl font-black text-white">{event.title}</h1>
        </div>
        <button
          onClick={() => navigate(`/events`)}
          className="text-gray-500 hover:text-white text-sm font-bold transition-colors"
        >
          Back to Events
        </button>
      </div>

      {!showEditor ? (
        /* MAIN DASHBOARD CARDS */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminCard
            title="Participants"
            desc="Manage registrations & data."
            icon={<Users className="text-blue-500" />}
            onClick={() => navigate(`/events/responses/${event._id}`)}
          />
          <AdminCard
            title="Edit Configuration"
            desc="Modify fields and deadlines."
            icon={<Edit className="text-purple-500" />}
            onClick={() => setShowEditor(true)}
          />
          <div
            onClick={handleToggleStatus}
            className={`bg-[#0e0e0e] border p-6 rounded-3xl transition-all cursor-pointer group ${
              event.isActive ? "border-green-500/30 hover:border-red-500/50" : "border-white/10 hover:border-green-500/50"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/5 rounded-2xl">
                {isUpdating ? (
                  <div className="h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                ) : event.isActive ? (
                  <ToggleRight className="text-green-500" size={24} />
                ) : (
                  <ToggleLeft className="text-gray-500" size={24} />
                )}
              </div>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-green-500">
              {event.isActive ? "Deactivate" : "Publish Event"}
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              {event.isActive ? "Click to take event offline." : "Click to go live."}
            </p>
          </div>
        </div>
      ) : (
        /* FULL INLINE EDITOR */
        <form
          onSubmit={handleUpdate}
          className="bg-[#0e0e0e] border border-green-500/30 p-8 rounded-3xl space-y-8 animate-in zoom-in-95 duration-300"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Edit size={20} className="text-green-500" /> Event Settings
            </h2>
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="text-gray-500 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Metadata */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Event Title</label>
                <input
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none h-32"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Deadline</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    style={{ colorScheme: "dark" }}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Right: Registration Form Builder */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Custom Form Fields</p>
                <button
                  type="button"
                  onClick={addField}
                  className="text-green-500 text-xs font-bold hover:bg-green-500/10 px-2 py-1 rounded transition-all flex items-center gap-1"
                >
                  <Plus size={14} /> New Field
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {editForm.fields.map((f, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input
                        placeholder="Label (e.g. Phone Number)"
                        className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                        value={f.label}
                        onChange={(e) => {
                          const newFields = [...editForm.fields];
                          newFields[i].label = e.target.value;
                          setEditForm({ ...editForm, fields: newFields });
                        }}
                      />
                      
                      <select 
                        className="bg-black border border-white/10 rounded-lg px-2 py-2 text-xs text-gray-400 outline-none cursor-pointer"
                        value={f.type}
                        onChange={(e) => {
                          const newFields = [...editForm.fields];
                          newFields[i].type = e.target.value as FieldType;
                          setEditForm({ ...editForm, fields: newFields });
                        }}
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="textarea">Large Text</option>
                        <option value="checkbox">Checkbox</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setEditForm({
                          ...editForm,
                          fields: editForm.fields.filter((_, idx) => idx !== i),
                        })}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isUpdating ? <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : "Save All Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Quick Preview Area */}
      <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl p-8">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Eye size={14} /> Poster Preview
        </h3>
        <div className="opacity-40  pointer-events-none scale-95 origin-top">
          <img
            src={event.image.url}
            alt="Event Poster"
            className="w-full h-48 object-cover rounded-2xl mb-4"
          />
          <p className="text-gray-400 text-sm line-clamp-1 italic">{event.description}</p>
        </div>
      </div>

      <button onClick={handleDeleteEvent} className="bg-red-600 hover:bg-red-500 hover:cursor-pointer text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-green-900/20">
            Delete Event
        </button>
    </div>
  );
};

// Sub-component for Dashboard Cards
const AdminCard = ({ title, desc, icon, onClick }: any) => (
  <div
    onClick={onClick}
    className="bg-[#0e0e0e] border border-white/10 p-6 rounded-3xl hover:border-white/30 transition-all cursor-pointer group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
      <ArrowRight
        className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all"
        size={18}
      />
    </div>
    <h3 className="text-lg font-bold text-white group-hover:text-green-500">{title}</h3>
    <p className="text-gray-500 text-xs mt-1">{desc}</p>
  </div>
);

export default AdminEventDashboard;