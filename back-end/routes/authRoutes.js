import { createUser } from "../controller/authController.js"
import express from "express"
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup",(req,res)=>{
    createUser(req,res);
})

export default router;