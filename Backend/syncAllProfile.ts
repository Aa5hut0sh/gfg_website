import cron from "node-cron";
import User from "./models/User.model";
import { getStats } from "./services/user.service";

const syncAllProfiles = async () => {
  console.log("Starting daily profile sync...", new Date().toISOString());

  const users = await User.find({
    $or: [
      { "codingProfiles.leetcode.username": { $exists: true } },
      { "codingProfiles.codeforces.username": { $exists: true } },
      { "codingProfiles.github.username": { $exists: true } },
    ],
  });

  console.log(`Found ${users.length} users to sync`);

  for (const user of users) {
    try {
      const { leetcode, codeforces, github } = user.codingProfiles || {};
      const syncTasks = [];

      if (leetcode?.username) syncTasks.push(getStats("leetcode", leetcode.username));
      if (codeforces?.username) syncTasks.push(getStats("codeforces", codeforces.username));
      if (github?.username) syncTasks.push(getStats("github", github.username));

      const results = await Promise.allSettled(syncTasks);
      const updateData: any = {};
      const now = new Date();

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const stats = result.value;
          if ("solved" in stats) {
            updateData["codingProfiles.leetcode"] = { ...leetcode, ...stats, lastUpdated: now };
          } else if ("rating" in stats && "contests" in stats) {
            updateData["codingProfiles.codeforces"] = { ...codeforces, ...stats, lastUpdated: now };
          } else if ("repos" in stats) {
            updateData["codingProfiles.github"] = { ...github, ...stats, lastUpdated: now };
          }
        }
      });

      if (Object.keys(updateData).length > 0) {
        await User.findByIdAndUpdate(user._id, { $set: updateData });
      }

      await new Promise((res) => setTimeout(res, 500));

    } catch (err) {
      console.error(`Failed to sync user ${user._id}:`, err);
    }
  }

  console.log("Daily sync complete.", new Date().toISOString());
};

export const startCronJobs = () => {
  cron.schedule("0 4 * * *", syncAllProfiles, {
    timezone: "Asia/Kolkata",
  });

  console.log("Daily sync job scheduled at 4:00 AM IST");
};