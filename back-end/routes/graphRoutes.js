import express from "express"
import { fetchGraph } from "../controller/graphController";

const router = express.Router();

router.post("/fetchGraph",(req,res)=>{
    fetchGraph(req,res);
});