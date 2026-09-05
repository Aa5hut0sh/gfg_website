import { motion } from "motion/react";
import { useAuth } from "../auth/authContext";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import TeamMemberList from "./Team";

const TeamContent = () => {
  const { user } = useAuth();

  return (
    <section className="relative w-full min-h-screen px-5 md:px-8 pt-24 pb-20">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col items-center text-center">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            text-4xl
            md:text-5xl
            lg:text-6xl
            font-bold
            text-white
            leading-tight
          "
        >
          Nothing great is{" "}
          <span
            className="
              inline-block
              bg-yellow-300
              text-black
              px-3
              py-1
              rounded-md
            "
          >
            made
          </span>{" "}
          alone.
        </motion.h1>

        {/* ================= ADMIN BUTTON ================= */}
        {user?.role === "ADMIN" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="mt-7"
          >
            <Link
              to="/team/admin"
              className="
                group
                relative
                overflow-hidden
                inline-flex
                items-center
                gap-2
                px-6
                py-3
                rounded-lg
                border
                border-green-400/70
                text-white
                font-semibold
                transition-all
                duration-300
                hover:border-green-300
                hover:bg-green-400/10
              "
            >
              {/* Shine */}
              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  group-hover:translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  transition-transform
                  duration-700
                "
              />

              <Settings
                size={17}
                className="relative z-10"
              />

              <span className="relative z-10">
                MANAGE TEAM
              </span>
            </Link>
          </motion.div>
        )}

        {user?.role !== "ADMIN" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="mt-7"
          >
            <div
              className="
                relative
                overflow-hidden
                border
                border-green-300/70
                text-white
                font-semibold
                py-3
                px-7
                rounded-lg
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  -translate-x-full
                  animate-[shine_2.5s_infinite]
                "
              />

              <span className="relative z-10">
                Meet Our Core Team
              </span>
            </div>
          </motion.div>
        )}

      </div>


      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
        className="
          w-full
          max-w-[1200px]
          mx-auto
          mt-8
        "
      >
        <TeamMemberList />
      </motion.div>

    </section>
  );
};

export default TeamContent;