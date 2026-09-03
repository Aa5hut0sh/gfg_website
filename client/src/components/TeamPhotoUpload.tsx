import { Image as ImageIcon } from "lucide-react";

interface Props {
  preview: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export default function TeamPhotoUpload({
  preview,
  onChange,
}: Props) {
  const openPicker = () => {
    document.getElementById("teamPhotoInput")?.click();
  };

  return (
    <div className="bg-[#0e0e0e] border border-white/10 p-8 rounded-3xl shadow-xl">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">
        Profile Photo
      </label>

      <div
        onClick={openPicker}
        className="group relative aspect-square rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-green-500/50 overflow-hidden"
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Team member preview"
              className="w-full h-full object-contain object-center"
            />

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                Change Photo
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <ImageIcon
              className="text-gray-600 mx-auto mb-3"
              size={40}
            />

            <span className="text-xs text-gray-500">
              Click to upload photo
            </span>

            <p className="text-[10px] text-gray-700 mt-2">
              JPG, PNG or WEBP
            </p>
          </div>
        )}

        <input
          id="teamPhotoInput"
          type="file"
          hidden
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={onChange}
        />
      </div>
    </div>
  );
}