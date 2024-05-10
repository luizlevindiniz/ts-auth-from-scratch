import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/status", function (req, res) {
  res.send("Online!");
});

app.use("/auth", authRouter);

app.listen(8080, () => console.log("Server running..."));
