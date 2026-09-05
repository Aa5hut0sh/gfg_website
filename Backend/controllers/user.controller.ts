import type { Request, Response, NextFunction } from "express";
import User from "./../models/User.model";
import { getStats } from "./../services/user.service";

interface LeetCodeStats {
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number;
}
interface CodeforcesStats {
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contests: number;
  totalSubmissions: number;
}
interface githubStats {
  repos: number;
  followers: number;
  stars: number;
  contributions: number;
}

export const addleetCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { leetcode } = req.body;
    const userId = req.userId;

    if(req.role=="ADMIN"){
      return res.status(400).json({
        success:false,
        message:"Admins can't add thier profile"
      });
    }

    const stats: LeetCodeStats = (await getStats(
      "leetcode",
      leetcode,
    )) as LeetCodeStats;

    if (!stats) {
      return res.status(400).json({
        success: false,
        message: "failed to fetch the profile",
      });
    }

    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        "codingProfiles.leetcode": {
          username: leetcode,
          solved: stats.solved,
          easy: stats.easy,
          medium: stats.medium,
          hard: stats.hard,
          ranking: stats.ranking,
          lastUpdated: new Date(),
        },
      },
    },{ new: true });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
export const addcodeforces = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { codeforces } = req.body;
    const userId = req.userId;

    if(req.role=="ADMIN"){
      return res.status(400).json({
        success:false,
        message:"Admins can't add thier profile"
      });
    }

    const stats: CodeforcesStats = (await getStats(
      "codeforces",
      codeforces,
    )) as CodeforcesStats;

    if (!stats) {
      return res.status(400).json({
        success: false,
        message: "failed to fetch the profile",
      });
    }

    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        "codingProfiles.codeforces": {
          username: codeforces,
          rating: stats.rating,
          maxRating: stats.maxRating,
          rank: stats.rank,
          maxRank: stats.maxRank,
          contests: stats.contests,
          totalSubmissions: stats.totalSubmissions,
          lastUpdated: new Date(),
        },
      },
    },{ new: true });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
export const addgithub = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { github } = req.body;
    const userId = req.userId;

    if(req.role=="ADMIN"){
      return res.status(400).json({
        success:false,
        message:"Admins can't add thier profile"
      });
    }

    const stats: githubStats = (await getStats(
      "github",
      github,
    )) as githubStats;

    if (!stats) {
      return res.status(400).json({
        success: false,
        message: "failed to fetch the profile",
      });
    }

    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        "codingProfiles.github": {
          username: github,
          repos: stats.repos,
          followers: stats.followers,
          stars: stats.stars,
          contributions: stats.contributions,
          lastUpdated: new Date(),
        },
      },
    },{ new: true });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const syncStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user || !user.codingProfiles) {
      return res
        .status(404)
        .json({ success: false, message: "No profiles found to sync" });
    }

    const { leetcode, codeforces, github } = user.codingProfiles;
    const syncTasks = [];

    if (leetcode?.username)
      syncTasks.push(getStats("leetcode", leetcode.username));
    if (codeforces?.username)
      syncTasks.push(getStats("codeforces", codeforces.username));
    if (github?.username) syncTasks.push(getStats("github", github.username));

    const results = await Promise.allSettled(syncTasks);

    const updateData: any = {};
    const now = new Date();

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        const stats = result.value;

        if ("solved" in stats && !("stars" in stats)) {
          updateData["codingProfiles.leetcode"] = {
            ...stats,
            lastUpdated: now,
          };
        } else if ("rating" in stats && "handle" in stats) {
          updateData["codingProfiles.codeforces"] = {
            ...stats,
            lastUpdated: now,
          };
        } else if ("repos" in stats) {
          updateData["codingProfiles.github"] = { ...stats, lastUpdated: now };
        }
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const leaderboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { type } = req.query;

    let sortField = {};

    if (type === "leetcode") {
      sortField = { "codingProfiles.leetcode.solved": -1 };
    }

    if (type === "codeforces") {
      sortField = { "codingProfiles.codeforces.rating": -1 };
    }

    if (type === "github") {
      sortField = { "codingProfiles.github.contributions": -1 };
    }

    const users = await User.find()
      .select("name codingProfiles")
      .sort(sortField)
      .limit(50);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};

export const removeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { platform } = req.params;

  await User.findByIdAndUpdate(req.userId, {
    $unset: { [`codingProfiles.${platform}`]: "" },
  });

  res.json({ success: true });
};

export const getProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.userId).select("codingProfiles");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      codingProfiles: user.codingProfiles,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    if(req.role=="USER"){
      return res.status(400).json({
        success:false,
        message:"User can't get all profile"
      });
    }
    const users = await User.find()
      .select("name email codingProfiles")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};
