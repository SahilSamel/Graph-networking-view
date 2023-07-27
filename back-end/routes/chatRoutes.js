import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {getProfileFromId,getProfileFromCommName} from "../controller/chatController.js"

const router = express.Router();
router.post("/getProfileFromId",(req,res)=>{
    getProfileFromId(req,res);
});

router.post("/getProfileFromCommName",(req,res)=>{
    getProfileFromCommName(req,res);
}
);

export default router;