import express from "express"
import { fetchGraph,makeConnection, searchUser, rejectRequest,sendRequest} from "../controller/graphController.js";

import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/fetchGraph",verifyToken,(req,res)=>{
    fetchGraph(req,res);
});

router.post("/makeConnection",verifyToken,(req,res)=>{
    makeConnection(req,res);
});

router.get("/searchUser",verifyToken,(req,res)=>{
    searchUser(req,res);
});



router.post("/rejectRequest",verifyToken,(req,res)=>{
    rejectRequest(req,res);
});

router.post("/sendRequest",verifyToken,(req,res)=>{
    sendRequest(req,res);
})

export default router;