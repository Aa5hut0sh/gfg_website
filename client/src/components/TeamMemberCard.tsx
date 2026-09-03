import {
    Image as ImageIcon,
    Pencil,
    Trash2,
  } from "lucide-react";
  
  import type { TeamMember } from "../services/team.service";
  
  interface Props {
    member: TeamMember;
    onEdit: (member: TeamMember) => void;
    onDelete: (id: string) => void;
  }
  
  export default function TeamMemberCard({
    member,
    onEdit,
    onDelete,
  }: Props) {
    return (
      <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all">
        <div className="aspect-square bg-black flex items-center justify-center">
          {member.photo?.url ? (
            <img
              src={member.photo.url}
              alt={member.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <ImageIcon
              size={40}
              className="text-gray-700"
            />
          )}
        </div>
  
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-white text-lg truncate">
                {member.name}
              </h3>
  
              <p className="text-green-400 text-sm mt-1">
                {member.role}
              </p>
  
              <p className="text-gray-600 text-xs mt-2">
                Batch {member.batchYear}
              </p>
            </div>
  
            <span className="text-xs text-gray-600">
              #{member.order}
            </span>
          </div>
  
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={() => onEdit(member)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
            >
              <Pencil size={16} />
              Edit
            </button>
  
            <button
              type="button"
              onClick={() => onDelete(member._id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }