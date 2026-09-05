import { useState } from "react";
import { FiX, FiExternalLink } from "react-icons/fi";

type Branch = {
  id: string;
  name: string;
  image: string;
  notes: { sem: number; link: string }[];
};

const branches: Branch[] = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770243312/image_2_pu3sla.jpg",
    notes: [
      { sem: 1, link: "https://drive.google.com/drive/folders/1x_51XuO_pO7k0CQyVaf5FWsY9-FhrV_l" },
      { sem: 2, link: "https://drive.google.com/drive/folders/1UCo0Ymnl0mymqZqv8c43cuwIcqU4BNbO" },
      { sem: 3, link: "https://drive.google.com/cse-sem3" },
      { sem: 4, link: "https://drive.google.com/cse-sem4" },
      { sem: 5, link: "https://drive.google.com/cse-sem5" },
      { sem: 6, link: "https://drive.google.com/cse-sem6" },
      { sem: 7, link: "https://drive.google.com/cse-sem7" },
      { sem: 8, link: "https://drive.google.com/cse-sem8" },
    ],
  },
  {
    id: "che",
    name: "Chemical Engineering",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770243492/64200535-dbba-4a64-a49b-d1635544f283_e8f3qf.jpg",
    notes: [
      { sem: 1, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 2, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 3, link: "https://drive.google.com/che-sem3" },
      { sem: 4, link: "https://drive.google.com/che-sem4" },
      { sem: 5, link: "https://drive.google.com/che-sem5" },
      { sem: 6, link: "https://drive.google.com/che-sem6" },
      { sem: 7, link: "https://drive.google.com/che-sem7" },
      { sem: 8, link: "https://drive.google.com/che-sem8" },
    ],
  },
  {
    id: "pe",
    name: "Petroleum Engineering",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770243601/46ba45d8-e2d4-40cc-a506-51c333ca5295_sminqz.jpg",
    notes: [
      { sem: 1, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 2, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 3, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 4, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 5, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 6, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 7, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 8, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
    ],
  },
  {
    id: "mac",
    name: "Mathematics & Computing",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770243765/8a4a5756-0b03-4f9e-80ed-622a60021b9a_zp13oz.jpg",
    notes: [
      { sem: 1, link: "https://drive.google.com/drive/folders/1qPUwzqIeKx4oz9TucTs80C4a1xnAGer7" },
      { sem: 2, link: "https://drive.google.com/drive/folders/16b0GG8BlM-hQq0x_J9f52NWaRc5X3UFb" },
      { sem: 3, link: "https://drive.google.com/mac-sem3" },
      { sem: 4, link: "https://drive.google.com/mac-sem4" },
      { sem: 5, link: "https://drive.google.com/mac-sem5" },
      { sem: 6, link: "https://drive.google.com/mac-sem6" },
      { sem: 7, link: "https://drive.google.com/mac-sem7" },
      { sem: 8, link: "https://drive.google.com/mac-sem8" },
    ],
  },
  {
    id: "eee",
    name: "Electrical and Electronics Engineering",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770243846/421fedfc-eb8c-4272-ade8-58840d9b604b_yd5p0f.jpg",
    notes: [
      { sem: 1, link: "https://drive.google.com/drive/folders/1x_51XuO_pO7k0CQyVaf5FWsY9-FhrV_l" },
      { sem: 2, link: "https://drive.google.com/eee-sem2" },
      { sem: 3, link: "https://drive.google.com/eee-sem3" },
      { sem: 4, link: "https://drive.google.com/eee-sem4" },
      { sem: 5, link: "https://drive.google.com/eee-sem5" },
      { sem: 6, link: "https://drive.google.com/eee-sem6" },
      { sem: 7, link: "https://drive.google.com/eee-sem7" },
      { sem: 8, link: "https://drive.google.com/eee-sem8" },
    ],
  },
  {
    id: "me",
    name: "Mechanical Engineering",
    image: "https://res.cloudinary.com/drfwbriwh/image/upload/v1770243933/5ac0784c-a765-4aae-95ea-62e9e249a87d_pcgd3y.jpg",
    notes: [
      { sem: 1, link: "https://drive.google.com/drive/folders/1k1VGmKArIZL5F3GBLvEelVXEDFXvIM3Q" },
      { sem: 2, link: "https://drive.google.com/me-sem2" },
      { sem: 3, link: "https://drive.google.com/me-sem3" },
      { sem: 4, link: "https://drive.google.com/me-sem4" },
      { sem: 5, link: "https://drive.google.com/me-sem5" },
      { sem: 6, link: "https://drive.google.com/me-sem6" },
      { sem: 7, link: "https://drive.google.com/me-sem7" },
      { sem: 8, link: "https://drive.google.com/me-sem8" },
    ],
  },
];

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

const Resources = () => {
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);
  return (
    <div className="min-h-screen  text-white px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-center mb-12">
          Academic <span className="text-green-400">Resources</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="rounded-2xl overflow-hidden border border-white/10 bg-black/10 backdrop-blur-md  hover:scale-[1.03] transition"
            >
              <img
                src={branch.image}
                alt={branch.name}
                className="h-44 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{branch.name}</h3>

                <button
                  onClick={() => setActiveBranch(branch)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 transition"
                >
                  Notes <FiExternalLink />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeBranch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setActiveBranch(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl bg-[#0a0a0a] border border-white/10 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveBranch(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FiX size={22} />
            </button>

            <h2 className="text-3xl font-bold mb-6">
              {activeBranch.name} – Notes
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {activeBranch.notes.map((note) => (
                <a
                  key={note.sem}
                  href={note.link}
                  target="_blank"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition"
                >
                  <p className="text-sm text-gray-400">Semester</p>
                  <p className="text-lg font-bold text-green-400">
                    Sem {note.sem}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

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
                    className="rounded-2xl overflow-hidden border border-white/10 bg-black/10 backdrop-blur-md hover:scale-[1.03] transition"
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
                    className="rounded-xl border border-white/10 bg-black/10 backdrop-blur-md p-6 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] transition"
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
    </div>

    
  );
};

export default Resources;