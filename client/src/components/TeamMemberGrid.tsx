import { Plus } from "lucide-react";

import TeamMemberCard from "./TeamMemberCard";

import type { TeamMember } from "../services/team.service";

interface Props {
  members: TeamMember[];
  selectedYear: number;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function TeamMemberGrid({
  members,
  selectedYear,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  if (members.length === 0) {
    return (
      <div className="text-center py-20 border border-white/10 rounded-3xl bg-[#0e0e0e]">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
          <Plus size={25} className="text-gray-600" />
        </div>

        <h3 className="text-white font-bold text-lg mt-4">
          No members in {selectedYear}
        </h3>

        <p className="text-gray-600 text-sm mt-2">
          Add the first member for this batch.
        </p>

        <button
          type="button"
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold"
        >
          <Plus size={17} />
          Add Team Member
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <TeamMemberCard
          key={member._id}
          member={member}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
