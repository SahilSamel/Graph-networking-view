import express from "express"

const router = express.Router();

router.get("/getProfile", (req, res)=>{
    getProfile(req,res);
});

export default router;