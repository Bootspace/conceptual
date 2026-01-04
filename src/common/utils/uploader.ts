import { bucket } from "@/common/config/gcs";

export const generateV4SignedPolicy = async (
    folder: string,
    fileName: string,
    contentType: string
) => {
    const fullPath= `${folder}/${Date.now()}-${fileName}`;
    const file = bucket.file(fullPath);

    const [url] = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: contentType,
    });

    return {upload_url: url, final_url: `https://storage.googleapis.com/${bucket.name}/${fullPath}` };
};