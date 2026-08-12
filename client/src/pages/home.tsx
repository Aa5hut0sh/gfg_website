import { Link } from "react-router-dom";
import Card from "../components/card";
import DynamicGallery from "@/components/DynamicGallery";
import Contact from "../components/contact";
import { FiArrowRight, FiCode, FiUsers, FiCalendar } from "react-icons/fi";
import {
  SiReact,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiDocker,
  SiGit,
  SiGithub,
  SiTailwindcss,
  SiNodedotjs,
  SiPrisma,
} from "react-icons/si";
import CountUp from "@/components/CountUp";
import GlowBlob from "@/components/GlowBlob";

const icons = [
  <SiReact />,
  <SiHtml5 />,
  <SiCss3 />,
  <SiJavascript />,
  <SiDocker />,
  <SiGit />,
  <SiGithub />,
  <SiTailwindcss />,
  <SiNodedotjs />,
  <SiPrisma />,
];

const cardsData = [
  {
    title: "Events",
    description: "Stay ahead with our latest workshops and Events",
    link: "/events",
    number: 1,
  },
  {
    title: "Resources",
    description: "Get access to study material with DSA and webDEv Roadmaps",
    link: "/resources",
    number: 2,
  },
  {
    title: "Our Teams",
    description: "Meet the minds behind the RGIPT Student Chapter.",
    link: "/team",
    number: 3,
  },
];

const Home = () => {
  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      <main className="relative">
        <section className=" top-0 relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-500 text-xs font-bold uppercase tracking-widest">
                RGIPT Student Chapter
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">
              LEAVE YOUR <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                MARK WITH GFG
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-12">
              The premier community for developers at RGIPT. We bridge the gap
              between academic theory and industry practice through heavy-duty
              builds and elite networking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to={"/codefolio"}>
                <button className="group px-10 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  JOIN THE COMMUNITY
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to={"/resources"}>
                <button className="px-10 py-4 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
                  VIEW RESOURCES
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="relative py-24overflow-hidden">
          <div className="w-screen overflow-hidden m-4">
            <div className="relative w-screen h-20 overflow-hidden">
              <div className="absolute left-0 top-0 h-full flex items-center gap-10 marquee-track">
                {icons.map((icon, i) => (
                  <div
                    key={`set1-${i}`}
                    className="flex justify-center items-center w-24 text-4xl
                         text-gray-600 hover:text-green-500 transition-colors"
                  >
                    {icon}
                  </div>
                ))}

                {/* Duplicate set */}
                {icons.map((icon, i) => (
                  <div
                    key={`set2-${i}`}
                    className="flex justify-center items-center w-24 text-4xl
                         text-gray-600 hover:text-green-500 transition-colors"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiCode />,
                  to: 50,
                  suffix: "k+",
                  label: "Lines of Code Pushed",
                },
                {
                  icon: <FiUsers />,
                  to: 500,
                  suffix: "+",
                  label: "Active Geeks",
                },
                {
                  icon: <FiCalendar />,
                  to: 25,
                  suffix: "+",
                  label: "Events Per Year",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="text-green-500 text-3xl mb-4">
                    {stat.icon}
                  </div>

                  <h4 className="text-5xl font-bold text-white mb-2 flex items-baseline">
                    <CountUp
                      to={stat.to}
                      from={0}
                      separator=","
                      duration={2}
                      startWhen={true} // This combined with useInView inside will trigger on scroll
                      className="count-up-text"
                    />
                    <span className="text-green-500 ml-1">{stat.suffix}</span>
                  </h4>

                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Sliding Bar (Reverse via CSS style or negative keyframe) */}
          <div className="w-screen m-4 overflow-hidden">
            <div className="relative w-screen h-20 overflow-hidden">
              <div className="absolute left-0 top-0 h-full flex items-center gap-10 marquee-track">
                {icons.map((icon, i) => (
                  <div
                    key={`set1-${i}`}
                    className="flex justify-center items-center w-24 text-4xl
                         text-gray-600 hover:text-green-500 transition-colors"
                  >
                    {icon}
                  </div>
                ))}

                {/* Duplicate set */}
                {icons.map((icon, i) => (
                  <div
                    key={`set2-${i}`}
                    className="flex justify-center items-center w-24 text-4xl
                         text-gray-600 hover:text-green-500 transition-colors"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- IMMERSIVE ABOUT SECTION --- */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Not Just a Club. <br />A Launchpad for Careers.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                GeeksforGeeks Student Chapter RGIPT is a student-led
                organization dedicated to empowering peers with the technical
                skills required in the modern world.
              </p>
              <ul className="space-y-4">
                {[
                  "Industry Expert Webinars",
                  "Hackathons & Coding Sprints",
                  "Open Source Contributions",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-gray-300"
                  >
                    <span className="w-5 h-[1px] bg-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Element: Mock Code Window */}
            <div
              className="
                group relative overflow-hidden
                bg-[#0a0a0a]
                border border-white/10
                rounded-2xl
                p-6
                shadow-2xl

                transition-all duration-300 ease-out
                hover:-translate-y-2
                hover:scale-[1.02]
                hover:border-green-500/30
              "
            >
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="font-mono text-sm space-y-2 text-gray-400">
                  <p>
                    <span className="text-blue-400">const</span>{" "}
                    <span className="text-green-400">GFG_RGIPT</span> = () =&gt;
                    &#123;
                  </p>
                  <p className="pl-4">
                    mission:{" "}
                    <span className="text-orange-400">"Build the Future"</span>,
                  </p>
                  <p className="pl-4">
                    members:{" "}
                    <span className="text-orange-400">"Passionate"</span>,
                  </p>
                  <p className="pl-4">
                    status:{" "}
                    <span className="text-orange-400">"Innovating"</span>
                  </p>
                  <p>&#125;;</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-black text-gray-200 uppercase tracking-[0.4em] mb-12">
            Life at GFG RGIPT
          </h2>
          <DynamicGallery />
        </section>

        {/* --- QUICK ACCESS SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-[1px] w-8 bg-green-500"></span>
                <span className="text-green-500 text-xs font-bold uppercase tracking-[0.3em]">
                  Directory
                </span>
              </div>
              <h3 className="text-4xl font-semibold tracking-tight text-white">
                Quick{" "}
                <span className="text-gray-500 underline decoration-green-500/30 underline-offset-8">
                  Access
                </span>
              </h3>
            </div>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Navigate through our resources, events, and community portals with
              ease.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardsData.map((card) => (
              <div
                key={card.title}
                className="group transition-all duration-500 ease-out hover:z-10"
              >
                <Card
                  title={card.title}
                  description={card.description}
                  link={card.link}
                  number={card.number}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Contact />
    </div>
  );
};

export default Home;
