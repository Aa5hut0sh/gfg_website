import { useEffect, useMemo, useState } from "react";
import ProfileCard from "./ProfileCard";
import {
  getTeamMembers,
  type TeamMember,
} from "../services/team.service";

export default function TeamMemberList() {
  const [selectedYear, setSelectedYear] =
    useState<number | null>(null);

  const [members, setMembers] =
    useState<TeamMember[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ============================================================
  // LOAD ALL TEAM MEMBERS
  // ============================================================

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getTeamMembers();

        setMembers(response.members || []);
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            "Unable to load team members",
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  // ============================================================
  // ONLY YEARS WHICH HAVE MEMBERS
  // ============================================================

  const availableYears = useMemo(() => {
    return Array.from(
      new Set(
        members.map(
          (member) => member.batchYear,
        ),
      ),
    ).sort((a, b) => a - b);
  }, [members]);

  // ============================================================
  // SELECT FIRST AVAILABLE YEAR
  // ============================================================

  useEffect(() => {
    if (
      availableYears.length > 0 &&
      !availableYears.includes(
        selectedYear ?? -1,
      )
    ) {
      setSelectedYear(
        availableYears[availableYears.length - 1],
      );
    }
  }, [availableYears, selectedYear]);

  // ============================================================
  // MEMBERS FOR SELECTED YEAR
  // ============================================================

  const filteredMembers = useMemo(() => {
    if (selectedYear === null) {
      return [];
    }

    return members
      .filter(
        (member) =>
          member.batchYear ===
          selectedYear,
      )
      .sort(
        (a, b) =>
          a.order - b.order,
      );
  }, [members, selectedYear]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="w-full text-center py-20">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }

  // ============================================================
  // NO TEAM MEMBERS
  // ============================================================

  if (availableYears.length === 0) {
    return (
      <div className="w-full text-center py-20">
        <p className="text-gray-500">
          Team members will appear here soon.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl px-6 py-10">

      {/* ======================================================
          YEAR TABS
      ======================================================= */}

      <div className="flex flex-wrap justify-center gap-3 mb-12">

        {availableYears.map((year) => {
          const active =
            selectedYear === year;

          return (
            <button
              key={year}
              onClick={() =>
                setSelectedYear(year)
              }
              className={`
                px-5 py-2.5
                rounded-full
                text-sm font-bold
                border
                transition-all

                ${
                  active
                    ? "bg-green-500 text-black border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.35)]"
                    : "bg-black/40 text-gray-400 border-white/10 hover:border-green-500/50 hover:text-white"
                }
              `}
            >
              {year}
            </button>
          );
        })}

      </div>

      {/* ======================================================
          TEAM MEMBERS
      ======================================================= */}

      {filteredMembers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">
            No team members found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

          {filteredMembers.map(
            (member) => (
              <ProfileCard
                key={member._id}
                name={member.name}
                title={member.role}
                handle={member.name
                  .toLowerCase()
                  .replace(/\s+/g, "")}
                status="Online"
                avatarUrl={
                  member.photo.url
                }
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                githubUrl={
                  member.github ||
                  undefined
                }
                linkedinUrl={
                  member.linkedin ||
                  undefined
                }
                onGithubClick={() => {
                  if (member.github) {
                    window.open(
                      member.github,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }
                }}
                onLinkedinClick={() => {
                  if (member.linkedin) {
                    window.open(
                      member.linkedin,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }
                }}
              />
            ),
          )}

        </div>
      )}

    </div>
  );
}