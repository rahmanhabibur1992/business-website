import { v2 as cloudinary } from "cloudinary";

const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  "npvxsx7y";

const apiKey =
  process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
  process.env.CLOUDINARY_API_KEY ||
  "685696584335865";

const apiSecret = process.env.CLOUDINARY_API_SECRET || "gGHuU_J3XWSr7_AmmtTickg4Gzs";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export function generateUploadSignature(folderType: "coaches" | "gallery") {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `rahman-chess-academy/${folderType}`;

  // Parameters to sign
  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  };
}

export async function destroyCloudinaryAsset(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.warn(`Failed to destroy Cloudinary asset ${publicId}:`, error);
    return false;
  }
}

export function formatCloudinaryUrl(url: string, width = 800): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  // Apply f_auto, q_auto, w_...
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
