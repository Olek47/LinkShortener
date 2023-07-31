import { Schema, model } from "mongoose";

const linkSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    uses: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true, versionKey: false });

export default model("Link", linkSchema);