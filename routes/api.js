import express from "express";
import rateLimit from "express-rate-limit";
import shortenController from "../controllers/shorten.js";
import Link from "../models/link.js";

const Router = express.Router();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        error: "Too many shortened URLs created from your IP, please try again after an hour!"
    },
    standardHeaders: true,
    legacyHeaders: false
});

Router.get("/", (req, res) => {
    res.send("Hello World!");
});

Router.get("/url", async (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({
            error: "Missing id query parameter!"
        });
    }

    const obj = await Link.findOne({
        id: req.query.id
    });

    if (!obj) {
        return res.status(404).json({
            error: "Shortened URL not found!"
        });
    }

    res.json({
        url: obj.url
    });
});

Router.post("/url", limiter, shortenController);

export default Router;