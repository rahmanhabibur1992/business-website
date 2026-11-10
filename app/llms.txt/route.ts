import { getAllPublicContent } from "@/lib/content-service";
import { SITE_CONTACT } from "@/lib/site-config";

export async function GET() {
  const content = await getAllPublicContent();

  const lines: string[] = [
    "# Rahman Chess Academy",
    "",
    "## Overview",
    "Rahman Chess Academy is an elite online chess coaching academy providing structured Grandmaster mentorship and FIDE apprenticeship.",
    "Rahman Chess Academy is 100% online, serving students across the world through live interactive cohorts and personalized calculation sessions.",
    "",
    "## Contact & Enrollment",
    `- Academy Name: Rahman Chess Academy`,
    `- Mode: 100% Online (conducted entirely virtually via interactive video and chess engines)`,
    `- Official Phone & WhatsApp: ${SITE_CONTACT.phone}`,
    `- Direct WhatsApp Link: ${SITE_CONTACT.whatsappUrl}`,
    `- Hours: ${SITE_CONTACT.hours}`,
    "",
    "## Online Curriculum & Classes",
  ];

  for (const c of content.classes) {
    lines.push(`### ${c.title} (${c.level})`);
    lines.push(`- Target Rating: ${c.ratingLabel || c.ratingRange}`);
    lines.push(`- Duration: ${c.duration} (${c.sessionLength} per session)`);
    lines.push(`- Batch Size: ${c.batchSize}`);
    lines.push(`- Schedule: ${c.schedule}`);
    lines.push(`- Description: ${c.description}`);
    lines.push(`- Modules: ${c.modules.join(", ")}`);
    if (c.perks) lines.push(`- Perks: ${c.perks}`);
    lines.push("");
  }

  lines.push("## Grandmaster Faculty");
  for (const coach of content.coaches) {
    lines.push(`### ${coach.name}`);
    lines.push(`- Title & Role: ${coach.roleLine || coach.role}`);
    lines.push(`- Peak Rating: ${coach.peakRating}`);
    if (coach.badge) lines.push(`- Badge: ${coach.badge}`);
    lines.push(`- Bio: ${coach.bio}`);
    const specs = coach.specialties || coach.specializations || [];
    if (specs.length > 0) lines.push(`- Specialties: ${specs.join(", ")}`);
    lines.push("");
  }

  lines.push("## Tournament Circuit");
  for (const t of content.tournaments) {
    lines.push(`### ${t.title}`);
    lines.push(`- Platform: ${t.platform}`);
    lines.push(`- Format: ${t.format}`);
    lines.push(`- Time Control: ${t.timeControl}`);
    lines.push(`- Day and Time: ${t.dayTime}`);
    lines.push(`- Details: ${t.description}`);
    lines.push("");
  }

  const plainText = lines.join("\n");

  return new Response(plainText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
