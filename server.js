import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import Link from "./models/link.js";
import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";

const PORT = process.env.PORT || 8000;
const TRUST_PROXY = parseInt(process.env.TRUST_PROXY) || "loopback";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/linkshortener";

const app = express();

app.locals.version = process.env.npm_package_version || "1.0";

// Setup view engine
app.set("views", "views");
app.set("view engine", "pug");

// Setup middlewares and routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(indexRouter);
app.use("/api", apiRouter);

// Trust proxy
app.set("trust proxy", TRUST_PROXY);

// Mongoose settings
mongoose.set("strictQuery", false);

// Stats update logic
async function updateStats() {
    app.locals.linksCount = await Link.count();

    const totalClicks = await Link.aggregate([
        {
            $group: { _id: null, total: { $sum: "$uses" }}
        }
    ]);

    app.locals.totalClicks = totalClicks[0] ? totalClicks[0].total : 0;
}

setInterval(updateStats, 5 * 60 * 1000);

(async () => {
    console.log("Connecting to the database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");
    
    await updateStats();
    
    await app.listen(PORT);
    console.log(`App is listening on port ${PORT}...`);
})();
