export type PdfGeneratorTemplateType = string;

export abstract class PdfGeneratorPort {
  // TODO: make data type safe and generic
  abstract request(template: PdfGeneratorTemplateType, data: Record<string, unknown>): Promise<Buffer>;
}
