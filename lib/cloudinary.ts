/**
 * Client-safe Cloudinary URL utilities.
 * Secrets are never imported here.
 */

export function formatCloudinaryUrl(url?: string, width = 800): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
