export interface SiteContactConfig {
  phone: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappUrl: string;
  whatsappMentorshipUrl: string;
  whatsappChatUrl: (text?: string) => string;
  hours: string;
  mode: string;
  lichessUrl: string;
  chessComUrl: string;
  youtubeUrl: string;
}

export const SITE_CONTACT: SiteContactConfig = {
  phone: "+91 72000 51588",
  phoneDisplay: "+91 72000 51588",
  phoneTel: "+917200051588",
  whatsappUrl: "https://wa.me/917200051588",
  whatsappMentorshipUrl: `https://wa.me/917200051588?text=${encodeURIComponent(
    "Hello Rahman Chess Academy, I'd like to know more about your online chess classes."
  )}`,
  whatsappChatUrl: (text?: string) =>
    text
      ? `https://wa.me/917200051588?text=${encodeURIComponent(text)}`
      : "https://wa.me/917200051588",
  hours: "Mon–Sat 09:00–21:00 IST",
  mode: "Online",
  lichessUrl: "https://lichess.org",
  chessComUrl: "https://chess.com",
  youtubeUrl: "https://youtube.com",
};

export function cleanText(input: string, maxLen = 60): string {
  // Strip control characters, trim, and cap length
  return input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim()
    .slice(0, maxLen);
}

export function buildEnrollWhatsAppUrl(data: {
  title: string;
  level: string;
  schedule: string;
  name: string;
  age: string | number;
}): string {
  const cleanName = cleanText(data.name, 60);
  const cleanAge = String(data.age).replace(/[^0-9]/g, "").slice(0, 2);

  const message = [
    "Hello Rahman Chess Academy 👋",
    "I'd like to enroll in an online chess class.",
    `*Class:* ${data.title}`,
    `*Level:* ${data.level}`,
    `*Schedule:* ${data.schedule}`,
    `*Student Name:* ${cleanName}`,
    `*Age:* ${cleanAge}`,
    "Please share the next steps.",
  ].join("\n");

  return `https://wa.me/917200051588?text=${encodeURIComponent(message)}`;
}

export function buildGeneralEnquiryWhatsAppUrl(data: {
  name: string;
  age: string | number;
}): string {
  const cleanName = cleanText(data.name, 60);
  const cleanAge = String(data.age).replace(/[^0-9]/g, "").slice(0, 2);

  const message = [
    "Hello Rahman Chess Academy 👋",
    "I'd like to enquire about your online chess classes.",
    `*Student Name:* ${cleanName}`,
    `*Age:* ${cleanAge}`,
    "Please share the details.",
  ].join("\n");

  return `https://wa.me/917200051588?text=${encodeURIComponent(message)}`;
}

export function buildEnquiryWhatsAppUrl(data: {
  enquiry: string;
  name: string;
  age: string | number;
}): string {
  const cleanName = cleanText(data.name, 60);
  const cleanAge = String(data.age).replace(/[^0-9]/g, "").slice(0, 2);
  const cleanEnquiry = cleanText(data.enquiry, 100);

  const message = [
    "Hello Rahman Chess Academy 👋",
    "I'd like to make an enquiry for online chess.",
    `*Enquiry:* ${cleanEnquiry}`,
    `*Student Name:* ${cleanName}`,
    `*Age:* ${cleanAge}`,
    "Please share the next steps.",
  ].join("\n");

  return `https://wa.me/917200051588?text=${encodeURIComponent(message)}`;
}
