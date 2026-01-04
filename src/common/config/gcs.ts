import { Storage } from "@google-cloud/storage";
import path from "path";

export const storage = new Storage({
    keyFilename: path.join(__dirname, "../../../google-key.json"),
    projectId: "node-conceptual"
});

export const bucket = storage.bucket("node-conceptual");