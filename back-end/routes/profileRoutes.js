import express from "express"
import { getProfile } from "../controller/profileController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/getProfile",verifyToken, (req, res)=>{
    getProfile(req,res);
});

export default router;