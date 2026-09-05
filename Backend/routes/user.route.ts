import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { addleetCode , addcodeforces , addgithub , removeProfile , syncStats , leaderboard , getProfiles, getAllProfiles } from "../controllers/user.controller";
const router = Router();

router.post("/profiles/leetcode",authenticate, addleetCode);
router.post("/profiles/codeforces",authenticate, addcodeforces);
router.post("/profiles/github",authenticate, addgithub);
router.delete("/profiles/:platform",authenticate, removeProfile);
router.get("/profiles",authenticate, getProfiles);
router.post("/profiles/sync",authenticate, syncStats);
router.get("/profiles/all",authenticate, getAllProfiles);
router.get("/leaderboard", leaderboard);

export default router;
