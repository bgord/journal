import * as tools from "@bgord/tools";
import {
  Document,
  type DocumentProps,
  Page,
  renderToBuffer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
// biome-ignore lint: lint/suspicious/noConsole
import React from "react";
import type * as Ports from "+emotions/ports";
import type * as Queries from "+emotions/queries";

type TemplateFn = (data: Record<string, any>) => React.ReactElement<DocumentProps>;

const styles = StyleSheet.create({
  h1: { fontSize: 24, marginBottom: 16, fontFamily: "Helvetica-Bold" },
  h2: { fontSize: 18, marginBottom: 12, marginTop: 24, fontFamily: "Helvetica-Bold" },
  h3: { fontSize: 14, marginBottom: 8, marginTop: 16, fontFamily: "Helvetica-Bold" },
  page: { padding: 32, fontSize: 12, fontFamily: "Helvetica" },
  p: { lineHeight: 1.5, marginBottom: 8 },
  strong: { fontFamily: "Helvetica-Bold" },
  label: { fontFamily: "Helvetica-Bold", marginRight: 8 },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  prose: { whiteSpace: "pre-wrap" },
});

const templates: Record<Ports.PdfGeneratorTemplateType, TemplateFn> = {
  weekly_review_export: (data) => {
    const { entries, patternDetections, alarms, ...weeklyReview } = data as Queries.WeeklyReviewExportDto;

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.h1}>Weekly review - {weeklyReview.weekIsoId}</Text>

          {weeklyReview.insights && (
            <>
              <Text style={styles.h2}>Insights</Text>
              <Text style={styles.p}>{weeklyReview.insights}</Text>
            </>
          )}

          {patternDetections.length > 0 && (
            <>
              <Text style={styles.h2}>Detected patterns</Text>
              {patternDetections.map((pattern, index) => (
                <View key={index}>
                  <Text style={styles.p}>- {pattern.name}</Text>
                </View>
              ))}
            </>
          )}

          {alarms.length > 0 && (
            <>
              <Text style={styles.h2}>Alarms</Text>
              {alarms.map((alarm, index) => (
                <View key={index}>
                  <Text style={styles.h3}>
                    Alarm - {alarm.name} ({tools.DateFormatters.datetime(alarm.generatedAt)})
                  </Text>
                  {alarm.advice && <Text style={styles.p}>{alarm.advice}</Text>}
                </View>
              ))}
            </>
          )}

          {entries.length > 0 && (
            <>
              <Text style={styles.h2}>Entries</Text>
              {entries.map((entry, index) => (
                <View key={index}>
                  <Text style={styles.h3}>Entry - {tools.DateFormatters.datetime(entry.startedAt)}</Text>

                  <View style={styles.row}>
                    <Text style={styles.label}>Situation:</Text>
                    <Text style={styles.prose}>{entry.situationDescription}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Emotion:</Text>
                    <Text>
                      {entry.emotionLabel} ({entry.emotionIntensity}/5)
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Reaction:</Text>
                    <Text style={styles.prose}>{entry.reactionDescription}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </Page>
      </Document>
    );
  },
  entry_export: () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Entry export</Text>
      </Page>
    </Document>
  ),
};

export class PdfGeneratorReact implements Ports.PdfGeneratorPort {
  async request(template: Ports.PdfGeneratorTemplateType, data: Record<string, unknown> = {}) {
    const build = templates[template];

    if (!build) throw new Error(`Unknown PDF template: ${template}`);

    const pdf = await renderToBuffer(build(data));

    return Buffer.from(pdf);
  }
}
