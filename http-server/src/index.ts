import express from "express";
import dotenv from "dotenv";
import getLLMres from "./getLLMres.js";

dotenv.config();
const PORT = process.env.HTTP_PORT || 3000;
const app = express();

app.use(express.json());

app.post("/llm", (req, res) => {
    getLLMres(req.body.prompt);
    res.send("LLM response sent");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});