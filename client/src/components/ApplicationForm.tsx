import { useState, useEffect } from "react";
import { applyApplication, getAllApplications, getFilledApplication } from "../services/application.service";
import type {
  ApplyApplicationPayload,
  Application,
} from "../types/application.types";
import { TEAMS } from "../constants/application.constant";
import { useAuth } from "../auth/authContext";
import {
  Phone,
  Award,
  Send,
  HelpCircle,
  Layers,
  Wrench,
  Users,
  Plus,
  X,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const ApplicationForm = ({
  onSubmitted,
}: {
  onSubmitted: (app: Application) => void;
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<Application | null>(null);
  const [allApplications, setAllApplications] = useState<Application[]>([]);

  const [form, setForm] = useState<ApplyApplicationPayload>({
    rollNo: "",
    MobileNo: "",
    preference1: "Technical Team",
    preference2: "Design Team",
    preference3: "Dev Team",
    reason: "",
    skills: [],
    OtherClubs: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [clubInput, setClubInput] = useState("");


  const addSkill = () => {
    if (!skillInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()],
    }));
    setSkillInput("");
  };

  const addClub = () => {
    if (!clubInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      OtherClubs: [...(prev.OtherClubs ?? []), clubInput.trim()],
    }));
    setClubInput("");
  };

  const removeItem = (
    index: number,
    key: "skills" | "OtherClubs"
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key]?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res: any = await applyApplication(form);
    
    if (res.form) {
      onSubmitted(res.form); 
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Submission failed");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "ADMIN") {
          const res = await getAllApplications();
          setAllApplications(res.forms || []);
        } else {
          const res = await getFilledApplication();
          setApplication(res.application);
        }
      } catch (err) {
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="max-w-2xl mt-25 mx-auto  border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/20 to-transparent p-8 border-b border-white/5">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Award className="text-green-500 w-8 h-8" />
          Join the Team
        </h1>
        <p className="text-gray-400 mt-2">
          Fill out the details below to start your journey with GFG RGIPT.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Roll No */}
        <input
          required
          placeholder="Roll Number (eg: 25cs3013)"
          value={form.rollNo}
          onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
          className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"
        />

        {/* Mobile */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-2">
            <Phone className="w-3 h-3" /> Contact Information
          </label>
          <input
            required
            type="tel"
            placeholder="Mobile Number"
            value={form.MobileNo}
            onChange={(e) => setForm({ ...form, MobileNo: e.target.value })}
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-green-500/50 outline-none"
          />
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-2">
            <Layers className="w-3 h-3" /> Team Preferences
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => {
              const key = `preference${num}` as keyof ApplyApplicationPayload;
              return (
                <div key={num} className="relative">
                  <span className="absolute -top-2 -left-2 w-5 h-5 bg-green-600 text-black text-[10px] font-bold flex items-center justify-center rounded-full z-10">
                    {num}
                  </span>
                  <select
                    value={form[key] as string}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-green-500 outline-none"
                  >
                    {TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <Section label="Skills" icon={Wrench}>
          <AddInput
            value={skillInput}
            onChange={setSkillInput}
            onAdd={addSkill}
            placeholder="Add a skill"
          />
          <ChipList
            items={form.skills}
            onRemove={(i:number) => removeItem(i, "skills")}
          />
        </Section>

        {/* Other Clubs */}
        <Section label="Other Clubs / Socities" icon={Users}>
          <AddInput
            value={clubInput}
            onChange={setClubInput}
            onAdd={addClub}
            placeholder="Add a club"
          />
          <ChipList
            items={form.OtherClubs ?? []}
            onRemove={(i:number) => removeItem(i, "OtherClubs")}
          />
        </Section>

        {/* Reason */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-2">
            <HelpCircle className="w-3 h-3" /> Why do you want to join?
          </label>
          <textarea
            required
            rows={4}
            placeholder="Tell us about your motivation and what you can bring to the team..."
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white resize-none"
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-500 text-black font-bold rounded-xl transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Submit Application
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;



const Section = ({ label, icon: Icon, children }: any) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 font-semibold">
      <Icon className="w-3 h-3" /> {label}
    </label>
    {children}
  </div>
);

const AddInput = ({ value, onChange, onAdd, placeholder }: any) => (
  <div className="flex gap-2">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 bg-black border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
    />
    <button
      type="button"
      onClick={onAdd}
      className="px-4 rounded-xl bg-green-600 hover:bg-green-500 text-black font-bold flex items-center gap-1"
    >
      <Plus className="w-4 h-4" /> Add
    </button>
  </div>
);

const ChipList = ({ items, onRemove }: any) => (
  <div className="flex flex-wrap gap-2">
    {items.length ? (
      items.map((item: string, i: number) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-gray-300"
        >
          {item}
          <button type="button" onClick={() => onRemove(i)}>
            <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      ))
    ) : (
      <span className="text-gray-500 italic text-sm">None added</span>
    )}
  </div>
);
