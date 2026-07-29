import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Lives under data/ (not public/) so a single persistent disk mounted at
// data/ covers both member records and uploaded images on hosts like Render.
const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function saveUploadedFile(file) {
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Please upload a JPG, PNG, WEBP, or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File is too large. Please upload an image under 5MB.");
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  const ext = path.extname(file.name || "") || `.${file.type.split("/")[1]}`;
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
  return `/api/uploads/${filename}`;
}
