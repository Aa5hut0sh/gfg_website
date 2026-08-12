import { useState } from "react";
import { motion } from "framer-motion";

const images = [
  {
    id: 1,
    url: "https://res.cloudinary.com/dxaq078zo/image/upload/v1770462107/IMG_6826_hxbpzz.jpg",
    title: "Web Workshops",
    desc: "Deep dive into React & Next.js",
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/dxaq078zo/image/upload/v1770462226/IMG_20250907_173147-Edit_cqs59v.jpg",
    title: "Competitive Programming",
    desc: "Mastering Data Structures",
  },
  {
    id: 3,
    url: "https://res.cloudinary.com/dxaq078zo/image/upload/v1770461862/IMG_20250907_170009_iec3fi.jpg",
    title: "Open Source",
    desc: "Contributing to the community",
  },
  {
    id: 4,
    url: "https://res.cloudinary.com/dxaq078zo/image/upload/v1770462391/IMG_6834_o0ummu.jpg",
    title: "Tech Talks",
    desc: "Insights from industry experts",
  },
];

export default function DynamicGallery() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="flex flex-col md:flex-row w-full h-[500px] gap-4 p-4">
      {images.map((img) => (
        <motion.div
          key={img.id}
          layout
          onClick={() => setExpandedId(img.id)}
          initial={{ borderRadius: 24 }}
          animate={{
            flex: expandedId === img.id ? 3 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative cursor-pointer overflow-hidden group border border-white/10"
        >
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
          
          <img
            src={img.url}
            alt={img.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Content inside the card */}
          <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
            <motion.div
              initial={false}
              animate={{
                x: expandedId === img.id ? 0 : -20,
                opacity: expandedId === img.id ? 1 : 0,
              }}
              className="space-y-1"
            >
              <h3 className="text-2xl font-black text-green-500 uppercase tracking-tighter">
                {img.title}
              </h3>
              <p className="text-white text-sm font-medium leading-tight">
                {img.desc}
              </p>
            </motion.div>
            
            {/* Minimalist Indicator for collapsed state */}
            {expandedId !== img.id && (
              <motion.div 
                layoutId={`indicator-${img.id}`}
                className="w-8 h-1 bg-green-500/50 rounded-full"
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}