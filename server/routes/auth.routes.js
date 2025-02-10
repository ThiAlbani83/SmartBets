import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  checkAuth,
  inviteUser,
  getAllUsers,
  toggleUserStatus,
  registerInvitedUser,
  getUserModules
} from "../controllers/auth.controller.js";
import { verificarToken } from "../middleware/verificarToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllUsers", getAllUsers);
router.get("/check-auth", verificarToken, checkAuth);
router.post("/logout", logoutUser);
router.patch("/toggle-status/:userId", toggleUserStatus);
router.post("/register/:token", registerInvitedUser);
router.post("/register-invited", registerInvitedUser);
router.post('/invite', inviteUser);
// Add this route
router.get("/user-modules", verificarToken, getUserModules);
export default router;
