import { useState } from "react";
import { registerForEvent } from "../services/event.service";
import { Event } from "../types/event.types";
import { toast } from "react-hot-toast";
import { Send, Asterisk, Calendar, ChevronDown, Info, Clock } from "lucide-react";

const RegistrationForm = ({ event, onSuccessfulSubmit }: { event: Event; onSuccessfulSubmit: () => void }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerForEvent(event._id, responses);
      toast.success("Successfully Registered!");
      onSuccessfulSubmit();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Banner Image Section */}
        <div className="relative h-64 md:h-80 w-full">
          <img 
            src={event.image.url} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent" />
          
          <div className="absolute bottom-6 left-8 right-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="bg-green-600 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Open for Registration
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{event.title}</h1>
          </div>
        </div>

        <div className="p-8 md:p-10">
          {/* Event Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
              <Info className="text-green-500 w-5 h-5 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">About Event</p>
                <p className="text-sm text-gray-300 mt-1 line-clamp-2">{event.description}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
              <Clock className="text-green-500 w-5 h-5 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deadline</p>
                <p className="text-sm text-gray-300 mt-1">
                  {event.deadline ? new Date(event.deadline).toLocaleString() : "To be announced"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-white/10"></div>
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] px-4">Registration Form</h3>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.fields.map((field) => (
                <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1 ml-1">
                    {field.label}
                    {field.required && <Asterisk size={8} className="text-red-500" />}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-green-500 outline-none transition-all resize-none min-h-[120px]"
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  ) : field.type === "select" ? (
                    <div className="relative">
                      <select
                        required={field.required}
                        className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-green-500 outline-none transition-all appearance-none cursor-pointer"
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      style={(field.type as string) === "date" || (field.type as string) === "datetime-local" ? { colorScheme: 'dark' } : {}}
                      placeholder={`Your ${field.label.toLowerCase()}`}
                      className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-green-500 outline-none transition-all"
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button Section */}
            <div className="pt-8">
              <button
                disabled={loading}
                className="group w-full py-5 bg-green-600 hover:bg-green-500 text-black font-black rounded-2xl transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-sm">Confirm Registration</span>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-[9px] text-gray-600 uppercase text-center mt-4 font-bold tracking-widest">
                GFG RGIPT Student Chapter • Official Event Registration
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;