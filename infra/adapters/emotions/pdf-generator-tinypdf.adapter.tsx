import type * as bg from "@bgord/bun";
import { pdf } from "tinypdf";

type TemplateFn = (data: Record<string, unknown>) => Uint8Array;

const PAGE_HEIGHT = 842;
const MARGIN_X = 48;
const MARGIN_TOP = 64;

const H1_SIZE = 24;

const templates: Record<bg.PdfGeneratorTemplateType, TemplateFn> = {
  weekly_review_export: () => {
    const doc = pdf();

    doc.page((ctx) => {
      const y = PAGE_HEIGHT - MARGIN_TOP - H1_SIZE;

      ctx.text("Weekly review export", MARGIN_X, y, H1_SIZE);
    });

    return doc.build();
  },

  entry_export: () => {
    const doc = pdf();

    doc.page((ctx) => {
      const y = PAGE_HEIGHT - MARGIN_TOP - H1_SIZE;

      ctx.text("Entry export", MARGIN_X, y, H1_SIZE);
    });

    return doc.build();
  },
};

export class PdfGeneratorTinypdfAdapter implements bg.PdfGeneratorPort {
  async request(template: bg.PdfGeneratorTemplateType, data: Record<string, unknown> = {}) {
    const build = templates[template];

    if (!build) {
      throw new Error(`Unknown PDF template: ${template}`);
    }

    return Buffer.from(build(data));
  }
}
