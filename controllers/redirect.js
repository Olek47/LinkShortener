import Link from "../models/link.js";

export default async (req, res, next) => {
    if (!req.params.id)
        return next();

    const obj = await Link.findOneAndUpdate({ id: req.params.id }, { $inc: { uses: 1 } });
    if (!obj)
        return next();

    res.redirect(obj.url);
};