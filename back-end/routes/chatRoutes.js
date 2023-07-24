import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {getProfileFromId} from "../controller/chatController.js"

const router = express.Router();
router.post("/getProfileFromId",(req,res)=>{
    getProfileFromId(req,res);
});

export default router;