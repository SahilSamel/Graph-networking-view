import express from "express";
import helmet from 'helmet';
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import fapp from "./connections/firebaseconfig.js"
import http from 'http'; 
import { Server } from 'socket.io'; 

// <-- Connections import -->
const app = express();
const server = http.createServer(app);
// <-- End of Connections import -->

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
// <-- Route Imports -->
import authRouter from "./routes/authRoutes.js"
import profileRouter from "./routes/profileRoutes.js"
import graphRouter from "./routes/graphRoutes.js"
import commRouter from "./routes/commRoutes.js"
import chatRouter from "./routes/chatRoutes.js"
// <-- End of Route Imports -->

// <-- Middleware -->
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// <-- End of Middleware -->

// <-- Routes -->
app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/graph",graphRouter);
app.use("/comm",commRouter);
app.use("/chat",chatRouter);
// <-- End of Routes -->


// Connection to port
const PORT = process.env.PORT || 4200;
server.listen(PORT, (err) => {
  if (err)
    throw err;
  console.log(`Server started on PORT ${PORT}...`);
});