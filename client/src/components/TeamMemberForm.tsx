import type {
    Dispatch,
    SetStateAction,
    ChangeEvent,
  } from "react";
  
  import TeamPhotoUpload from "./TeamPhotoUpload";
  import { YEARS, type TeamFormData } from "../constants/team";
  
  interface Props {
    form: TeamFormData;
    setForm: Dispatch<SetStateAction<TeamFormData>>;
    preview: string;
    editingId: string | null;
    saving: boolean;
    onImageChange: (
      event: ChangeEvent<HTMLInputElement>,
    ) => void;
    onSubmit: () => void;
  }
  
  export default function TeamMemberForm({
    form,
    setForm,
    preview,
    editingId,
    saving,
    onImageChange,
    onSubmit,
  }: Props) {
    const update = (
      key: keyof TeamFormData,
      value: string | number,
    ) => {
      setForm((previous) => ({
        ...previous,
        [key]: value,
      }));
    };
  
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
      >
        <div className="lg:col-span-2 bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl space-y-6">
          <Field
            label="Name"
            value={form.name}
            placeholder="e.g. Ashish Yadav"
            onChange={(value) => update("name", value)}
          />
  
          <Field
            label="Role"
            value={form.role}
            placeholder="e.g. Vice President"
            onChange={(value) => update("role", value)}
          />
  
          <Field
            label="LinkedIn"
            value={form.linkedin}
            placeholder="https://linkedin.com/in/username"
            onChange={(value) => update("linkedin", value)}
          />
  
          <Field
            label="GitHub"
            value={form.github}
            placeholder="https://github.com/username"
            onChange={(value) => update("github", value)}
          />
  
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="label">Batch Year</label>
  
              <select
                value={form.batchYear}
                onChange={(event) =>
                  update(
                    "batchYear",
                    Number(event.target.value),
                  )
                }
                className="input"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="label">Display Order</label>
  
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(event) =>
                  update(
                    "order",
                    Number(event.target.value),
                  )
                }
                className="input"
              />
            </div>
          </div>
        </div>
  
        <div className="space-y-6">
          <TeamPhotoUpload
            preview={preview}
            onChange={onImageChange}
          />
  
          <button
            type="submit"
            disabled={saving}
            className="w-full py-5 bg-green-500 hover:bg-green-400 text-black font-extrabold rounded-2xl disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Member"
                : "Add Member"}
          </button>
        </div>
      </form>
    );
  }
  
  function Field({
    label,
    value,
    placeholder,
    onChange,
  }: {
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
  }) {
    return (
      <div>
        <label className="label">{label}</label>
  
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="input"
        />
      </div>
    );
  }