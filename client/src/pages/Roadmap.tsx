import { useState } from "react";
import { FiX, FiExternalLink } from "react-icons/fi";

type Roadmap = {
  id: string;
  name: string;
  image: string;
  resources: { title: string; link: string }[];
};

const roadmaps: Roadmap[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770484435/maxresdefault_mpqmyx.jpg",
    resources: [
      { title: "DSA Sheet", link: "https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z" },
      { title: "DSA Playlist", link: "https://youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&si=ZC-GOzHR01pJvbTq" },
    ],
  },
  {
    id: "cp",
    name: "Competitive Programming",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770484531/download_tieczk.png",
    resources: [
      { title: "CP Sheet", link: "https://www.tle-eliminators.com/cp-sheet" },
      { title: "CP Playlist", link: "https://youtube.com/playlist?list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-&si=-ceILkqthC0TNUMF" },
    ],
  },
  {
    id: "backend",
    name: "Backend Development",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770484689/download_fp5kuf.jpg",
    resources: [
      { title: "Backend Sheet", link: "https://roadmap.sh/backend" },
      { title: "Backend Playlist", link: "https://youtube.com/playlist?list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW&si=EzNWJ8gqarkBJsbz" },
    ],
  },
  {
    id: "ml",
    name: "Machine Learning",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770484874/download_1_nl7ayi.png",
    resources: [
      { title: "ML Sheet", link: "https://roadmap.sh/ai-data-scientist" },
      { title: "ML Playlist", link: "https://youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH&si=3HadXkFL-gRtwfhr" },
    ],
  },
];

const paidCourses = [
  {
    id: "paid-cp",
    name: "Competitive Programming (Paid)",
    link: "https://tle-eliminators.com/",
  },
  {
    id: "paid-dev",
    name: "Full Stack Development (Paid)",
    link: "https://harkirat.classx.co.in/new-courses/21",
  },
  {
    id: "paid-ml",
    name: "Machine Learning (Paid)",
    link: "https://www.udemy.com/course/complete-machine-learning-nlp-bootcamp-mlops-deployment/?srsltid=AfmBOor7PciiFzcgnfXR2OcNWB5NxEZc_RIhqZ042yjq_YaDHpkSJ9-a",
  },
];

const Roadmap = () => {
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);

  return (
    <div className="min-h-screen text-white px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-center mb-12">
          Learning <span className="text-green-400">Roadmaps</span>
        </h1>

        {/* Free Roadmaps */}
        <h2 className="text-3xl font-bold mb-6">Free Roadmaps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:scale-[1.03] transition"
            >
              <img
                src={roadmap.image}
                alt={roadmap.name}
                className="h-44 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{roadmap.name}</h3>

                <button
                  onClick={() => setActiveRoadmap(roadmap)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 transition"
                >
                  View Roadmap <FiExternalLink />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paid Courses */}
        <h2 className="text-3xl font-bold mb-6">Paid Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paidCourses.map((course) => (
            <a
              key={course.id}
              href={course.link}
              target="_blank"
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition"
            >
              <h3 className="text-lg font-bold mb-2">{course.name}</h3>
              <p className="text-sm text-gray-400">
                Click to explore course →
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeRoadmap && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setActiveRoadmap(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-[#0a0a0a] border border-white/10 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveRoadmap(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FiX size={22} />
            </button>

            <h2 className="text-3xl font-bold mb-6">
              {activeRoadmap.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeRoadmap.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.link}
                  target="_blank"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition"
                >
                  <p className="text-lg font-semibold text-green-400">
                    {res.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    Click to open →
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;