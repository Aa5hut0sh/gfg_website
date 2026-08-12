import axios from "axios";

const token = process.env.GITHUB_TOKEN;
export async function getStats(platform: string, platformId: string) {
  let apiResponse = {};
  try {
    if (platform === "github") {
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      const headers = { ...authHeaders, Accept: "application/vnd.github+json" };

      const [userResponse, reposResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${platformId}`, { headers }),
        axios.get(
          `https://api.github.com/users/${platformId}/repos?per_page=100&type=owner`,
          { headers },
        ),
      ]);

      const userData = userResponse.data;
      const reposData: any[] = reposResponse.data;

      const totalStars = reposData.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0),
        0,
      );

      const contribRes = await axios.get(`https://github-contributions-api.deno.dev/${platformId}.json`);
      const totalContributions = contribRes.data.totalContributions;
      

      apiResponse = {
        username: userData.login,
        repos: userData.public_repos || 0,
        followers: userData.followers || 0,
        following: userData.following || 0,
        stars: totalStars,
        contributions:totalContributions||0,
      };
    }

    if (platform === "leetcode") {
      try {
        const graphqlQuery = {
          query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
          variables: { username: platformId },
        };

        const response = await axios.post(
          "https://leetcode.com/graphql",
          graphqlQuery,
          {
            headers: {
              "Content-Type": "application/json",
              Referer: "https://leetcode.com",
            },
            timeout: 10000,
          },
        );

        const user = response.data?.data?.matchedUser;

        if (!user) {
          throw new Error("User not found or invalid username");
        }

        const submissions = user.submitStatsGlobal?.acSubmissionNum || [];

        const getCount = (difficulty: string) =>
          submissions.find((s: any) => s.difficulty === difficulty)?.count || 0;

        apiResponse = {
          username: user.username,
          solved: getCount("All"),
          ranking: user.profile?.ranking || "N/A",
          easy: getCount("Easy"),
          medium: getCount("Medium"),
          hard: getCount("Hard"),
        };
      } catch (error) {
        throw error;
      }
    }

    if (platform === "codeforces") {
      try {
        const response = await axios.get(
          `https://codeforces.com/api/user.info?handles=${platformId}`,
          {
            timeout: 10000,
          },
        );

        if (response.data.status === "OK" && response.data.result.length > 0) {
          const userData = response.data.result[0];

          let ratingData;
          try {
            const ratingResponse = await axios.get(
              `https://codeforces.com/api/user.rating?handle=${platformId}`,
              {
                timeout: 5000,
              },
            );
            ratingData =
              ratingResponse.data.status === "OK"
                ? ratingResponse.data.result
                : [];
          } catch (ratingError) {
            console.warn("Failed to fetch rating history:", ratingError);
            ratingData = [];
          }

          let submissionStats;
          try {
            const submissionResponse = await axios.get(
              `https://codeforces.com/api/user.status?handle=${platformId}`,
              {
                timeout: 5000,
              },
            );
            const totalSubmissions =
              submissionResponse.data.status === "OK"
                ? submissionResponse.data.result.length
                : 0;
            submissionStats = { totalSubmissions };
          } catch (submissionError) {
            console.warn("Failed to fetch submission stats:", submissionError);
            submissionStats = { totalSubmissions: 0 };
          }

          apiResponse = {
            username: userData.handle,
            rating: userData.rating || 0,
            maxRating: userData.maxRating || userData.rating || 0,
            rank: userData.rank || "Unrated",
            maxRank: userData.maxRank || userData.rank || "Unrated",
            contribution: userData.contribution || 0,
            lastOnline: userData.lastOnlineTimeSeconds
              ? new Date(
                  userData.lastOnlineTimeSeconds * 1000,
                ).toLocaleDateString()
              : "Unknown",
            contests: ratingData.length,
            ...submissionStats,
          };
        } else {
          throw new Error("User not found or handle does not exist");
        }
      } catch (error) {
        console.error("Codeforces API failed:", error);

        apiResponse = {
          handle: platformId,
          rating: 0,
          maxRating: 0,
          rank: "Unrated",
          maxRank: "Unrated",
          contribution: 0,
          contests: 0,
          note: "Stats unavailable - API failed. Connection saved for manual update.",
        };
      }
    }
  } catch (error) {
    throw error;
  }

  return apiResponse;
}
