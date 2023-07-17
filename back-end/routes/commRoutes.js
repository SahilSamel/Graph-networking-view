import { createCommunity } from "../controller/commController.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Create Community Node
router.post("/createCommunity", verifyToken, (req, res) => {
    createCommunity(req, res);
});

export default router;