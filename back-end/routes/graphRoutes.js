import express from "express"
import { fetchGraph,makeConnection, deleteConnection } from "../controller/graphController.js";
import verifyToken from "../middleware/verifyToken.js"
const router = express.Router();


router.get("/fetchGraph",(req,res)=>{
    fetchGraph(req,res);
});

// <-- CONNECTION FUNCTIONALITIES -->
router.post("/makeConnection", verifyToken, (req,res)=>{
    makeConnection(req,res);
});

router.post("/deleteConnection", verifyToken, (req,res)=>{
    deleteConnection(req,res);
});
// <-- End of CONNECTION FUNCTIONALITIES -->

export default router;