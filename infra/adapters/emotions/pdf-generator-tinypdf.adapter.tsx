import type * as bg from "@bgord/bun";
import { pdf } from "tinypdf";

type TemplateFn = (data: Record<string, any>) => Uint8Array;

const templates: Record<bg.PdfGeneratorTemplateType, TemplateFn> = {
  weekly_review_export: () => {
    const doc = pdf();

    doc.page((ctx) => {
      ctx.rect(50, 700, 200, 40, "#2563eb");
      ctx.text("Hello PDF!", 60, 712, 24, { color: "#ffffff" });
      ctx.line(50, 680, 250, 680, "#000000", 1);
    });

    return doc.build();
  },
  entry_export: () => {
    const doc = pdf();

    doc.page((ctx) => {
      ctx.rect(50, 700, 200, 40, "#2563eb");
      ctx.text("Hello PDF!", 60, 712, 24, { color: "#ffffff" });
      ctx.line(50, 680, 250, 680, "#000000", 1);
    });

    return doc.build();
  },
};

export class PdfGeneratorTinypdfAdapter implements bg.PdfGeneratorPort {
  async request(template: bg.PdfGeneratorTemplateType, data: Record<string, unknown> = {}) {
    const build = templates[template];

    if (!build) throw new Error(`Unknown PDF template: ${template}`);

    const pdf = build(data);

    return Buffer.from(pdf);
  }
}
