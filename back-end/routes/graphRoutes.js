import express from "express"
import { fetchGraph } from "../controller/graphController.js";

const router = express.Router();

router.get("/fetchGraph",(req,res)=>{
    fetchGraph(req,res);
});

export default router;