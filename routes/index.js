import express from "express";
import redirectController from "../controllers/redirect.js";

const Router = express.Router();

Router.get("/", (req, res) => {
    res.render("home");
});

Router.get("/:id", redirectController);

export default Router;