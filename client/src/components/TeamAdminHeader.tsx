import { Plus, X } from "lucide-react";

interface Props {
  showForm: boolean;
  onAdd: () => void;
  onCancel: () => void;
}

export default function TeamAdminHeader({
  showForm,
  onAdd,
  onCancel,
}: Props) {
  return (
    <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Manage Team
        </h1>

        <p className="text-gray-500 mt-2">
          Add and manage GFG chapter team members.
        </p>
      </div>

      {showForm ? (
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={17} />
          Cancel
        </button>
      ) : (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold transition-all"
        >
          <Plus size={18} />
          Add Team Member
        </button>
      )}
    </div>
  );
}