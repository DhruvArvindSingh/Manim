import express from "express";
import dotenv from "dotenv";
import getLLMres from "./getLLMres.js";
import add_work from "./socket.js";

dotenv.config();
const PORT = process.env.HTTP_PORT || 3000;
const app = express();

app.use(express.json());

app.post("/llm", (req, res) => {
    console.log("LLM request received");
    req.body.prompt != "" ? add_work(req.body.prompt) : res.status(400).send("Prompt is empty");
    res.send("LLM response sent");

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});