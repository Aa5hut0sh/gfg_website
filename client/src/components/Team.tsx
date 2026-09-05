import { useEffect, useMemo, useState } from "react";
import ProfileCard from "./ProfileCard";
import TeamYearDial from "./TeamYearDial";

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

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTeamMembers();

        const loadedMembers =
          response.members || [];

        setMembers(loadedMembers);
      } catch (err: any) {
        console.error(
          "Failed to load team:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load team members"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  const availableYears = useMemo(() => {
    return Array.from(
      new Set(
        members.map(
          (member) => member.batchYear
        )
      )
    ).sort((a, b) => b - a);
  }, [members]);

  useEffect(() => {
    if (availableYears.length === 0) {
      setSelectedYear(null);
      return;
    }

    if (
      selectedYear === null ||
      !availableYears.includes(selectedYear)
    ) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const filteredMembers = useMemo(() => {
    if (selectedYear === null) {
      return [];
    }

    return members
      .filter(
        (member) =>
          member.batchYear === selectedYear
      )
      .sort(
        (a, b) => a.order - b.order
      );
  }, [members, selectedYear]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="h-10 w-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (availableYears.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">
          No team members available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* YEAR SELECTOR */}
      <div className="flex justify-center mb-6">
        <TeamYearDial
          years={availableYears}
          selectedYear={selectedYear!}
          onChange={setSelectedYear}
        />
      </div>

      {/* TEAM MEMBERS */}
      <div className="mt-4">

        {filteredMembers.length === 0 ? (
          <div className="py-16 text-center border border-white/10 rounded-3xl">
            <p className="text-gray-500">
              No members found for {selectedYear}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">

            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="w-full max-w-[350px]"
              >
                <ProfileCard
                  name={member.name}

                  title={member.role}

                  handle={member.name
                    .toLowerCase()
                    .replace(/\s+/g, "")}

                  status="Online"

                  avatarUrl={member.photo.url}

                  showUserInfo={true}

                  enableTilt={true}

                  enableMobileTilt={false}

                  githubUrl={
                    member.github || undefined
                  }

                  linkedinUrl={
                    member.linkedin || undefined
                  }

                  onGithubClick={() => {
                    if (member.github) {
                      window.open(
                        member.github,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}

                  onLinkedinClick={() => {
                    if (member.linkedin) {
                      window.open(
                        member.linkedin,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                />
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}