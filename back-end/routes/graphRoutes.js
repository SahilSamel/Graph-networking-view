import express from "express"
import { fetchGraph,makeConnection } from "../controller/graphController.js";

const router = express.Router();

router.get("/fetchGraph",(req,res)=>{
    fetchGraph(req,res);
});

router.post("/makeConnection",(req,res)=>{
    makeConnection(req,res);
});

export default router;