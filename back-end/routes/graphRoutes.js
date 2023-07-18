import express from "express"
import { fetchGraph, getConnections, makeConnection, deleteConnection } from "../controller/graphController.js";
import verifyToken from "../middleware/verifyToken.js"
const router = express.Router();

// <-- FETCH FUNCTIONALITIES -->

// Fetch Graph
router.get("/fetchGraph",(req,res)=>{
    fetchGraph(req,res);
});

// Fetch Connections 
router.get("/fetchConnections", verifyToken, (req, res) => {
    getConnections(req, res);
});

// <-- End of FETCH FUNCTIONALITIES -->

// <-- CONNECTION FUNCTIONALITIES -->

// Make Connection 
router.post("/makeConnection", verifyToken, (req,res)=>{
    makeConnection(req,res);
});

// Delete connection/Leave Community 
router.post("/deleteConnection", verifyToken, (req,res)=>{
    deleteConnection(req,res);
});
// <-- End of CONNECTION FUNCTIONALITIES -->

export default router;