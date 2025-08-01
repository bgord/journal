import * as Ports from "+emotions/ports";
import { Document, Page, renderToBuffer, StyleSheet, Text } from "@react-pdf/renderer";
import React from "react";

type TemplateFn = (data: Record<string, any>) => React.ReactElement;

const templates: Record<Ports.PdfGeneratorTemplateType, TemplateFn> = {
  weekly_review_export: (data) => {
    const styles = StyleSheet.create({
      page: { padding: 32, fontSize: 12, fontFamily: "Helvetica" },
      title: { fontSize: 18, marginBottom: 12 },
    });

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Weekly review - {String(data.weekIsoId)}</Text>
        </Page>
      </Document>
    );
  },
};

export class ReactPdfGenerator implements Ports.PdfGeneratorPort {
  async request(
    template: Ports.PdfGeneratorTemplateType,
    data: Record<string, unknown> = {},
  ): Promise<Buffer> {
    const build = templates[template];

    if (!build) throw new Error(`Unknown PDF template: ${template}`);

    // @ts-expect-error
    const pdf = await renderToBuffer(build(data));
    return Buffer.from(pdf);
  }
}
