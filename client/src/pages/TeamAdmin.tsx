import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  updateTeamMember,
  type TeamMember,
} from "../services/team.service";

import { YEARS, emptyTeamForm, type TeamFormData } from "../constants/team";

import TeamAdminHeader from "../components/TeamAdminHeader";
import TeamMemberForm from "../components/TeamMemberForm";
import TeamMemberGrid from "../components/TeamMemberGrid";


export default function TeamAdmin() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2023);

  const [form, setForm] = useState<TeamFormData>(emptyTeamForm);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await getTeamMembers();
      setMembers(response.members || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const resetForm = () => {
    setForm({ ...emptyTeamForm, batchYear: selectedYear });
    setImage(null);
    setPreview("");
    setEditingId(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member._id);
    setShowForm(true);

    setForm({
      name: member.name,
      role: member.role,
      batchYear: member.batchYear,
      linkedin: member.linkedin || "",
      github: member.github || "",
      order: member.order || 0,
    });

    setPreview(member.photo?.url || "");
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.role.trim()) return toast.error("Role is required");

    if (form.batchYear < 2023 || form.batchYear > 2035) {
      return toast.error("Batch year must be between 2023 and 2035");
    }

    if (!editingId && !image) {
      return toast.error("Please upload a team member photo");
    }

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    if (image) data.append("photo", image);

    try {
      setSaving(true);

      if (editingId) {
        await updateTeamMember(editingId, data);
        toast.success("Team member updated successfully!");
      } else {
        await createTeamMember(data);
        toast.success("Team member added successfully!");
      }

      resetForm();
      setShowForm(false);
      await loadMembers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;

    try {
      await deleteTeamMember(id);
      toast.success("Team member deleted successfully!");
      await loadMembers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete team member");
    }
  };

  const visibleMembers = members
    .filter((member) => member.batchYear === selectedYear)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-6xl mx-auto py-24 px-6">
      <TeamAdminHeader
        showForm={showForm}
        onAdd={handleAdd}
        onCancel={handleCancel}
      />

      {showForm && (
        <TeamMemberForm
          form={form}
          setForm={setForm}
          preview={preview}
          editingId={editingId}
          saving={saving}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
        />
      )}

      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Team Members
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Manage members by batch.
            </p>
          </div>

          <select
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(Number(event.target.value))
            }
            className="bg-[#0e0e0e] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500"
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-4">
              Loading team members...
            </p>
          </div>
        ) : (
          <TeamMemberGrid
            members={visibleMembers}
            selectedYear={selectedYear}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        )}
      </section>
    </div>
  );
}