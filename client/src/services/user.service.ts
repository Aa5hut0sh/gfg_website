import api from "../lib/api";
import {
  CodingProfilesResponse,
  UserResponse,
  LeaderboardResponse,
  LeaderboardType,
  PlatformType,
} from "../types/codingProfiles.types";

export const addLeetCodeProfile = async (
  username: string
): Promise<UserResponse> => {
  const res = await api.post("user/profiles/leetcode", { leetcode: username });
  return res.data;
};

export const addCodeforcesProfile = async (
  username: string
): Promise<UserResponse> => {
  const res = await api.post("user/profiles/codeforces", { codeforces: username });
  return res.data;
};

export const addGithubProfile = async (
  username: string
): Promise<UserResponse> => {
  const res = await api.post("user/profiles/github", { github: username });
  return res.data;
};

export const getProfiles = async (): Promise<CodingProfilesResponse> => {
  const res = await api.get("user/profiles");
  return res.data;
};

export const syncProfiles = async (): Promise<UserResponse> => {
  const res = await api.post("user/profiles/sync");
  return res.data;
};

export const removeProfile = async (
  platform: PlatformType
): Promise<{ success: boolean }> => {
  const res = await api.delete(`user/profiles/${platform}`);
  return res.data;
};

export const getLeaderboard = async (
  type: LeaderboardType
): Promise<LeaderboardResponse> => {
  const res = await api.get(`user/leaderboard?type=${type}`);
  return res.data;
};

export const getAllUsersProfiles = async (): Promise<{ success: boolean; users: any[] }> => {
  const res = await api.get("user/profiles/all");
  return res.data;
};