import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LaunchPage = () => {
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);


  const particles = Array.from({ length: 50 });
 
  const dataBlocks = Array.from({ length: 15 });

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden relative">
      
      

    
      <div className="absolute inset-0 pointer-events-none">
        {dataBlocks.map((_, i) => (
          <motion.div
            key={`block-${i}`}
            initial={{ opacity: 0.1 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              y: [0, -20, 0] 
            }}
            transition={{ 
              duration: Math.random() * 5 + 3, 
              repeat: Infinity,
              delay: Math.random() * 5 
            }}
            className="absolute text-green-500/20 text-[10px] font-mono hidden md:block"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
          >
            {`0x${Math.random().toString(16).slice(2, 8).toUpperCase()}`}
          </motion.div>
        ))}
      </div>

     
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isLaunching ? { opacity: 0, scale: 1.2, filter: "blur(15px)" } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <h1 className="text-white text-5xl md:text-8xl font-black tracking-tighter uppercase mb-20 relative">
          GFG OFFICIAL WEBSITE
          <motion.div 
             animate={{ opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-green-500 rounded-full"
          />
        </h1>

        <div className="relative inline-block group">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-1 bg-green-500 rounded-full blur opacity-20 group-hover:opacity-60 transition"
          />
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className={`relative px-20 py-8 border-2 border-green-500 rounded-full text-green-500 text-3xl font-black tracking-[0.2em] transition-all duration-500 
              ${isLaunching ? "bg-green-500 text-black border-transparent" : "hover:bg-green-500 hover:text-black shadow-[0_0_30px_rgba(34,197,94,0.2)]"}`}
          >
            {isLaunching ? "ACCESSING..." : "LAUNCH"}
          </button>
        </div>
      </motion.div>


      <AnimatePresence>
        {isLaunching && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {particles.map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "50vw", y: "50vh", scale: 1 }}
                animate={{ 
                  x: `${Math.random() * 100}vw`, 
                  y: `${Math.random() * 100}vh`,
                  scale: 0,
                  opacity: 0,
                  rotate: 360
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-1 h-4 bg-green-500 rounded-full"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LaunchPage;