import {
  createUser,
  registerUser,
  checkLogin,
  signIn,
  uidDatabaseCheck,
} from "../controller/authController.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// <-- USER AUTH FUNCTIONALITIES -->

// Sign up user using email/pass
router.post("/signup", (req, res) => {
  createUser(req, res);
});

// Sign in user using email/pass
router.post("/signin", (req, res) => {
  signIn(req, res);
});

// Check if user already logged in
router.get("/checkLogin", (req, res) => {
  checkLogin(req, res);
});

// <-- End of USER AUTH FUNCTIONALITIES -->

// <-- DATABASE FUNCTIONALITIES -->

// Create database entry for user
router.post("/createProfile", (req, res) => {
  registerUser(req, res);
});

// Check if entry for user exists in database
router.post("/dbCheck", (req, res) => {
  uidDatabaseCheck(req, res);
});

// <-- End of DATABASE FUNCTIONALITIES -->

export default router;
