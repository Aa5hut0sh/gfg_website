import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

interface CardProps {
  title: string;
  description: string;
  link: string;
  number:number;
}

const Card = ({ title, description, link , number }: CardProps) => {
  return (
    <Link 
      to={link}
      className="relative block h-full p-8 bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-green-500/40 group/card"
    >
      {/* Subtle Background Interaction */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          {/* Icon/Decoration */}
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/card:bg-green-500 group-hover/card:text-black transition-all duration-500">
            <FiArrowUpRight className="text-lg" />
          </div>
          
          {/* Decorative Numbering */}
          <span className="text-white/5 font-mono text-4xl group-hover/card:text-green-500/10 transition-colors">
            0{number}
          </span>
        </div>

        <div className="mt-auto">
          <h4 className="text-xl font-medium text-white mb-2 group-hover/card:translate-x-1 transition-transform duration-300">
            {title}
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Modern Hairline Bottom Gradient */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-green-500 to-transparent group-hover/card:w-full transition-all duration-700" />
    </Link>
  );
};

export default Card;