import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/event.service";
import { EventField, FieldType } from "../types/event.types";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  AlignLeft,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Info
} from "lucide-react";
import { toast } from "react-hot-toast";

const formatForDateTimeLocal = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isActive, setIsActive] = useState(true); 

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [fields, setFields] = useState<EventField[]>([
    { label: "Full Name", name: "fullName", type: "text", required: true },
  ]);

  const addField = () => {
    const newField: EventField = {
      label: "",
      name: `field_${Date.now()}`,
      type: "text",
      required: false,
      options: [],
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, key: keyof EventField, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload an event banner");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.deadline) {
      formData.append("deadline", form.deadline);
    }
    formData.append("image", image);
    formData.append("isActive", String(isActive)); // Send as string for FormData
    formData.append("fields", JSON.stringify(fields));

    try {
      await createEvent(formData);
      toast.success(isActive ? "Event published!" : "Event saved as draft!");
      navigate("/events");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Check your field definitions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-24 px-6">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Create Event</h1>
          <p className="text-gray-500 mt-2">Design your event registration form and details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl space-y-5 shadow-xl">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
              <input
                required
                placeholder="e.g. Web Development Workshop"
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 transition-all outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
              <textarea
                required
                placeholder="What is this event about?"
                rows={4}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 transition-all outline-none resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Deadline</label>
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                <input
                  type="datetime-local"
                  required
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-0"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Form Builder */}
          <div className="bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlignLeft className="text-green-500 w-5 h-5" /> Registration Fields
              </h3>
              <button
                type="button"
                onClick={addField}
                className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
              >
                <Plus size={18} /> Add New Field
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={index} className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-4 group transition-all hover:border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <input
                        placeholder="Field Label (e.g. Your Email)"
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-green-500 outline-none"
                        value={field.label}
                        onChange={(e) => updateField(index, "label", e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-4">
                      <select
                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-green-500 outline-none"
                        value={field.type}
                        onChange={(e) => updateField(index, "type", e.target.value as FieldType)}
                      >
                        <option value="text">Short Text</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="textarea">Long Description</option>
                        <option value="select">Dropdown (Select)</option>
                        <option value="checkbox">Multiple Choice</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 flex items-center justify-between px-2">
                      <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          className="accent-green-500 h-4 w-4"
                          checked={field.required}
                          onChange={(e) => updateField(index, "required", e.target.checked)}
                        /> Req.
                      </label>
                      <button type="button" onClick={() => removeField(index)} className="text-red-500/50 hover:text-red-500 ml-auto">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {(field.type === "select" || field.type === "checkbox") && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <input
                        placeholder="Options (separate with commas: Yes, No, Maybe)"
                        className="w-full bg-green-500/5 border border-green-500/20 rounded-xl p-3 text-xs text-green-400 focus:border-green-500 outline-none"
                        onChange={(e) =>
                          updateField(
                            index,
                            "options",
                            e.target.value.split(",").map((s) => s.trim()).filter((s) => s !== "")
                          )
                        }
                        value={field.options?.join(", ")}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Visibility Toggle Section */}
          <div className="bg-[#0e0e0e] border border-white/10 p-6 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-2">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Visibility</label>
               <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="focus:outline-none transition-colors"
               >
                 {isActive ? (
                   <ToggleRight className="text-green-500 w-10 h-10" />
                 ) : (
                   <ToggleLeft className="text-gray-600 w-10 h-10" />
                 )}
               </button>
            </div>
            <div className="flex items-start gap-2 bg-black/40 p-3 rounded-xl border border-white/5">
                <Info size={14} className="text-gray-500 mt-0.5" />
                <p className="text-[10px] text-gray-500 leading-tight">
                    {isActive 
                      ? "Public: Users can view and register for this event immediately." 
                      : "Draft: Event will be hidden from the public events page."}
                </p>
            </div>
          </div>

          <div className="bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl shadow-xl">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">Banner Image</label>
            <div
              className="group relative aspect-[4/3] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-green-500/50 hover:bg-green-500/[0.02] transition-all overflow-hidden"
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="text-gray-600 mx-auto mb-3 group-hover:text-green-500 transition-colors" size={40} />
                  <span className="text-xs text-gray-500 font-medium">Click to upload banner</span>
                </div>
              )}
              <input id="imageInput" type="file" hidden accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-green-600 hover:bg-green-500 text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                {isActive ? "Publishing..." : "Saving Draft..."}
              </div>
            ) : (
              isActive ? "Publish Event" : "Save as Draft"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;