import express from "express"
import { getProfile, getIfConnected, editProfile } from "../controller/profileController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// <-- PROFILE FUNCTIONALITIES -- >

router.get("/getProfile",verifyToken, (req, res)=>{
    getProfile(req,res);
});


router.post("/editProfile",verifyToken,(req, res)=>{
    editProfile(req,res);
});

router.post("/getIfConnected", verifyToken, (req, res) => {
    getIfConnected(req, res);
});

// <-- End of PROFILE FUNCTIONALITIES -- >

export default router;