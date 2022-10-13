import express from "express";
import cors from "cors";
import {createServer} from "http";
import {Server} from "socket.io";
import {
  createMessage,
  fetchAllMessages,
} from "./controller/message-controller.js";

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const router = express.Router();
router.get("/", (_, res) => {
  res.send("Hello World from communication-service");
});

router.post("/message", createMessage);
router.get("/message/:sessionId", fetchAllMessages);

app.use("/api/communication", router).all((_, res) => {
  res.setHeader("content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
});

const PORT = process.env.PORT || 8008;

const httpServer = createServer(app);

const socketIOServer = new Server(httpServer, {
  // Edit here to include new URL to access socket
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

socketIOServer.on("connection", (clientSocket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, () =>
  console.log(`communication-service listening on port ${PORT}`)
);