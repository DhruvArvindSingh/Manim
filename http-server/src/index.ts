import express from "express";
import dotenv from "dotenv";
import { generateSlug } from 'random-word-slugs'
import add_work from "./socket.js";

dotenv.config();
const PORT = process.env.HTTP_PORT || 3000;
const app = express();

app.use(express.json());

app.post("/llm", (req, res) => {
    const slug = new Date().getTime().toString() + "-" + generateSlug();
    // const slug = "test";
    console.log("LLM request received");
    req.body.prompt != "" ? add_work(req.body.prompt, slug) : res.status(400).send("Prompt is empty");
    res.send({
        slug
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});