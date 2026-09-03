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
      {/* ================= LEFT ================= */}

      <div
        className="
          lg:col-span-2
          bg-[#0e0e0e]
          border border-white/10
          rounded-3xl
          p-8
        "
      >
        <div className="space-y-7">

          {/* Name */}

          <Field
            label="Name"
            value={form.name}
            placeholder="e.g. Ashish Yadav"
            onChange={(value) =>
              update("name", value)
            }
          />

          {/* Role */}

          <Field
            label="Role"
            value={form.role}
            placeholder="e.g. Vice President"
            onChange={(value) =>
              update("role", value)
            }
          />

          {/* Social links */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">

            <Field
              label="LinkedIn"
              value={form.linkedin}
              placeholder="https://linkedin.com/in/username"
              onChange={(value) =>
                update("linkedin", value)
              }
            />

            <Field
              label="GitHub"
              value={form.github}
              placeholder="https://github.com/username"
              onChange={(value) =>
                update("github", value)
              }
            />

          </div>

          {/* Small separator */}

          <div className="h-px bg-white/[0.06] my-2" />

          {/* Batch + Order */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Batch */}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2.5">
                Batch Year
              </label>

              <select
                value={form.batchYear}
                onChange={(event) =>
                  update(
                    "batchYear",
                    Number(event.target.value),
                  )
                }
                className="
                  w-full
                  h-12
                  px-4
                  bg-black
                  border border-white/10
                  rounded-xl
                  text-white
                  outline-none
                  cursor-pointer
                  transition-all
                  duration-200
                  hover:border-white/20
                  focus:border-green-500/50
                  focus:ring-1
                  focus:ring-green-500/20
                "
              >
                {YEARS.map((year) => (
                  <option
                    key={year}
                    value={year}
                    className="bg-[#0e0e0e]"
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Order */}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2.5">
                Display Order
              </label>

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
                className="
                  w-full
                  h-12
                  px-4
                  bg-black
                  border border-white/10
                  rounded-xl
                  text-white
                  outline-none
                  transition-all
                  duration-200
                  hover:border-white/20
                  focus:border-green-500/50
                  focus:ring-1
                  focus:ring-green-500/20
                "
              />

              <p className="text-gray-600 text-xs mt-2">
                Lower number appears first.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* ================= RIGHT ================= */}

      <div className="flex flex-col gap-6">

        {/* Photo */}

        <div
          className="
            bg-[#0e0e0e]
            border border-white/10
            rounded-3xl
            p-6
          "
        >
          <div className="mb-5">
            <p className="text-white font-semibold">
              Profile Photo
            </p>

            <p className="text-gray-600 text-xs mt-1">
              Upload a clear photo of the member.
            </p>
          </div>

          <TeamPhotoUpload
            preview={preview}
            onChange={onImageChange}
          />
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={saving}
          className="
            w-full
            h-14
            bg-green-500
            hover:bg-green-400
            active:scale-[0.99]
            text-black
            font-extrabold
            rounded-2xl
            transition-all
            duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
            shadow-lg
            shadow-green-500/10
          "
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


/* ========================================================= */
/* FIELD                                                       */
/* ========================================================= */

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
      <label className="block text-sm font-medium text-gray-400 mb-2.5">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          w-full
          h-12
          px-4
          bg-black
          border border-white/10
          rounded-xl
          text-white
          placeholder:text-gray-700
          outline-none
          transition-all
          duration-200
          hover:border-white/20
          focus:border-green-500/50
          focus:ring-1
          focus:ring-green-500/20
        "
      />
    </div>
  );
}