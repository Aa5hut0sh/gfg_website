

export interface LeetCodeProfile {
  username: string;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
  lastUpdated?: string;
}

export interface CodeforcesProfile {
  username: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contests: number;
  totalSubmissions: number;
  lastUpdated?: string;
}

export interface GithubProfile {
  username: string;
  repos: number;
  followers: number;
  following: number;
  stars: number;
  lastUpdated?: string;
}

export interface CodingProfiles {
  leetcode?: LeetCodeProfile;
  codeforces?: CodeforcesProfile;
  github?: GithubProfile;
}

export interface CodingProfilesResponse {
  success: boolean;
  codingProfiles: CodingProfiles;
}

export interface UserResponse {
  success: boolean;
  user: {
    codingProfiles: CodingProfiles;
  };
}

export interface LeaderboardUser {
  name: string;
  codingProfiles: CodingProfiles;
}

export interface LeaderboardResponse {
  success: boolean;
  users: LeaderboardUser[];
}

export type LeaderboardType = "leetcode" | "codeforces" | "github";
export type PlatformType = "leetcode" | "codeforces" | "github";