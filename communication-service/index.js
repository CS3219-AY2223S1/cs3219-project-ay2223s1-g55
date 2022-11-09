import express from "express";
import cors from "cors";
import {createServer} from "http";
import {
  createMessage,
  fetchAllMessages,
} from "./controller/message-controller.js";
import {createSocketIOServer} from "./socket/index.js";
import verifyToken from "./utils/verifyToken.js";
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const router = express.Router();
router.get("/", (_, res) => {
  res.send("Hello World from communication-service");
});

// Protected Routes
router.post("/message", verifyToken, createMessage);
router.get("/message/:sessionId", verifyToken, fetchAllMessages);

app.use("/api/communication", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

const PORT = process.env.PORT || 8005;

const httpServer = createServer(app);

createSocketIOServer(httpServer);

httpServer.listen(PORT, () =>
  console.log(`communication-service listening on port ${PORT}`)
);

export default app;
