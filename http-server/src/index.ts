import express from "express";
import dotenv from "dotenv";
import { generateSlug } from 'random-word-slugs'
import add_work from "./socket.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.HTTP_PORT || 3000;
const app = express();

app.use(cors());

app.use(express.json());

app.post("/llm", (req, res) => {
    const slug = new Date().getTime().toString() + "-" + generateSlug();
    let status: string | undefined = "";
    // const slug = "test1";
    // const slug = "test";
    console.log("LLM request received");
    req.body.prompt != "" ? status = add_work(req.body.prompt, slug) : res.status(400).send("Prompt is empty");
    res.send({
        slug,
        status
    });
});

app.post("/llm_rerun", (req, res) => {
    const slug = new Date().getTime().toString() + "-" + generateSlug();
    let status: string | undefined = "";
    // const slug = "test1";
    // const slug = "test";
    console.log("LLM request received");
    req.body.prompt != "" && req.body.code != "" ? status = add_work(JSON.stringify(req.body), slug, true) : res.status(400).send("Prompt or code is empty");
    res.send({
        slug,
        status
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});