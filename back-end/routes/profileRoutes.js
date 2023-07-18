import express from "express"
import { getProfile,editProfile } from "../controller/profileController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/getProfile",verifyToken, (req, res)=>{
    getProfile(req,res);
});
router.post("/editProfile",verifyToken,(req, res)=>{
    editProfile(req,res);
});

export default router;