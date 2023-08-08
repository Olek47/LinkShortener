import Link from "../models/link.js";
import { nanoid } from "nanoid";

const ID_LENGTH = parseInt(process.env.ID_LENGTH) || 4;
const PROTOCOLS = ["http:", "https:"];
const SERVER_HOST = process.env.SERVER_HOST || "127.0.0.1";
const SERVER_URL = process.env.SERVER_URL || "http://127.0.0.1:8000/";

async function newID() {
    let id, obj;
    do {
        id = nanoid(ID_LENGTH);
        obj = await Link.exists({ id });
    } while(obj);
    return id;
}

async function newShortenedURL(url) {
    let obj = await Link.findOne({ url });
    if (obj) {
        return obj.id;
    }

    const urlID = await newID();
    obj = await Link.create({ url, id: urlID });
    return obj.id;
}

function isValidURL(url) {
    try {
        const urlObj = new URL(url);

        if (!PROTOCOLS.includes(urlObj.protocol))
            return false;
        
        if (urlObj.username || urlObj.password)
            return false;

        if (SERVER_HOST == urlObj.hostname)
            return false;
        
        return true;
    } catch (_) {
        return false;
    }
}

export default (req, res) => {
    if (!req.body.url) {
        return res.status(400).json({
            error: "URL parameter is empty!"
        });
    }

    if (req.body.url.length > 255) {
        return res.status(400).json({
            error: "URL parameter is too long!"
        });
    }

    if (!isValidURL(req.body.url)) {
        return res.status(400).json({
            error: "Not a valid URL!"
        });
    }

    newShortenedURL(req.body.url).then((id) => {
        res.json({
            link: SERVER_URL + id
        });
    });
};