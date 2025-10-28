import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import * as Components from "../components";
import * as Sections from "../sections";

export function Dashboard() {
  const t = UI.useTranslations();

  return (
    <main data-stack="y" data-gap="8">
      <Sections.DashboardHeatmap />

      <div data-stack="x" data-gap="5" data-mx="auto" data-color="neutral-200" data-px="1">
        <section data-fs="sm" {...UI.Rhythm(450).times(1).style.width}>
          <h2 data-stack="x" data-cross="center" data-gap="3" data-fw="regular" data-fs="base">
            <Icons.Alarm data-size="md" data-color="brand-300" /> {t("dashboard.alarm.header")}
          </h2>

          <Sections.DashboardAlarmsInactivity />

          <Components.DashboardCell data-mt="5">
            <h2 data-stack="x" data-gap="3" data-fs="base">
              {t("dashboard.alarm.entry")}
              <div className="c-badge" data-variant="primary">
                {/* {loaderData.alarms.entry.length} */} 2
              </div>
            </h2>

            {/* {!loaderData.alarms.entry[0] && ( */}
            {/*   <div data-mt="5" data-fs="sm" data-color="neutral-400"> */}
            {/*     {t("dashboard.alarm.entries.empty")} */}
            {/*   </div> */}
            {/* )} */}

            {/* {loaderData.alarms.entry[0] && ( */}
            {/*   <ul data-stack="y" data-gap="5" data-mt="5"> */}
            {/*     {loaderData.alarms.entry.map((alarm) => ( */}
            {/*       <li key={alarm.id} data-bct="neutral-800" data-bwt="hairline" data-pt="3"> */}
            {/*         <div data-stack="x" data-gap="3"> */}
            {/*           <div data-fs="sm" data-color="neutral-500"> */}
            {/*             {alarm.generatedAt} */}
            {/*           </div> */}

            {/*           <div data-color="neutral-300"> */}
            {/*             {t(`dashboard.alarm.entry.${alarm.name}.description`, { */}
            {/*               emotionLabel: t(`entry.emotion.label.value.${alarm.emotionLabel}`), */}
            {/*             })} */}
            {/*           </div> */}

            {/*           <div data-color="neutral-100"> */}
            {/*             <Icons.Sparks data-size="sm" data-color="brand-100" data-mr="1" /> "{alarm.advice}" */}
            {/*           </div> */}
            {/*         </div> */}
            {/*       </li> */}
            {/*     ))} */}
            {/*   </ul> */}
            {/* )} */}
          </Components.DashboardCell>
        </section>

        <section data-fs="sm" {...UI.Rhythm(450).times(1).style.width}>
          <h2 data-stack="x" data-cross="center" data-gap="3" data-fw="regular" data-fs="base">
            <Icons.Notes data-size="md" data-color="brand-300" /> {t("dashboard.entries.header")}
          </h2>

          <Components.DashboardCell data-mt="3">
            <h2 data-stack="x" data-gap="3" data-fs="base">
              {t("dashboard.entries.counts")}
            </h2>

            <div data-stack="x" data-main="between" data-mt="5" data-px="8">
              <div data-stack="y" data-cross="center" data-gap="2">
                <div data-color="neutral-500" data-transform="center">
                  {t("dashboard.entries.today")}
                </div>
                <div data-fs="3xl" data-fw="bold">
                  {/* {loaderData.entries.counts.today} */} 2
                </div>
              </div>

              <div data-stack="y" data-cross="center" data-gap="2">
                <div data-color="neutral-500" data-transform="center">
                  {t("dashboard.entries.last_week")}
                </div>
                <div data-fs="3xl" data-fw="bold">
                  {/* {loaderData.entries.counts.lastWeek} */} 2
                </div>
              </div>

              <div data-stack="y" data-cross="center" data-gap="2">
                <div data-color="neutral-500" data-transform="center">
                  {t("dashboard.entries.all")}
                </div>
                <div data-fs="3xl" data-fw="bold">
                  {/* {loaderData.entries.counts.all} */} 2
                </div>
              </div>
            </div>
          </Components.DashboardCell>

          {/* {loaderData.entries.topEmotions.today[0] && */}
          {/*   loaderData.entries.topEmotions.lastWeek[0] && */}
          {/*   loaderData.entries.topEmotions.all[0] && ( */}
          {/*     <Components.DashboardCell data-mt="5"> */}
          {/*       <h2 data-stack="x" data-gap="3" data-fs="base"> */}
          {/*         {t("dashboard.entries.top_emotions")} */}
          {/*       </h2> */}

          {/*       <div data-stack="x" data-main="between" data-mt="5"> */}
          {/*         <div data-stack="y" data-cross="center" data-fs="sm"> */}
          {/*           <div data-color="neutral-500" data-transform="center"> */}
          {/*             {t("dashboard.entries.today")} */}
          {/*           </div> */}

          {/*           <ul data-stack="y" data-mt="3" data-gap="2"> */}
          {/*             {loaderData.entries.topEmotions.today.map((stat, index) => ( */}
          {/*               <li key={`top-emotions-today-${stat.hits}-${index}`} data-stack="x" data-gap="2"> */}
          {/*                 <div className="c-badge" data-variant="primary"> */}
          {/*                   {stat.hits} */}
          {/*                 </div> */}
          {/*                 <div data-fs="xs">{t(`entry.emotion.label.value.${stat.label}`)}</div> */}
          {/*               </li> */}
          {/*             ))} */}
          {/*           </ul> */}
          {/*         </div> */}

          {/*         <div data-stack="y" data-cross="center" data-fs="sm"> */}
          {/*           <div data-color="neutral-500" data-transform="center"> */}
          {/*             {t("dashboard.entries.last_week")} */}
          {/*           </div> */}

          {/*           <ul data-stack="y" data-mt="3" data-gap="2"> */}
          {/*             {loaderData.entries.topEmotions.lastWeek.map((stat, index) => ( */}
          {/*               <li key={`top-emotions-last-week-${stat}-${index}`} data-stack="x" data-gap="2"> */}
          {/*                 <div className="c-badge" data-variant="primary"> */}
          {/*                   {stat.hits} */}
          {/*                 </div> */}
          {/*                 <div data-fs="xs">{t(`entry.emotion.label.value.${stat.label}`)}</div> */}
          {/*               </li> */}
          {/*             ))} */}
          {/*           </ul> */}
          {/*         </div> */}

          {/*         <div data-stack="y" data-cross="center" data-fs="sm"> */}
          {/*           <div data-color="neutral-500" data-transform="center"> */}
          {/*             {t("dashboard.entries.all")} */}
          {/*           </div> */}

          {/*           <ul data-stack="y" data-mt="3" data-gap="2"> */}
          {/*             {loaderData.entries.topEmotions.all.map((stat, index) => ( */}
          {/*               <li key={`top-emotions-all-${stat}-${index}`} data-stack="x" data-gap="2"> */}
          {/*                 <div className="c-badge" data-variant="primary"> */}
          {/*                   {stat.hits} */}
          {/*                 </div> */}
          {/*                 <div data-fs="xs">{t(`entry.emotion.label.value.${stat.label}`)}</div> */}
          {/*               </li> */}
          {/*             ))} */}
          {/*           </ul> */}
          {/*         </div> */}
          {/*       </div> */}
          {/*     </Components.DashboardCell> */}
          {/*   )} */}

          {/* {loaderData.entries.topReactions[0] && ( */}
          {/*   <Components.DashboardCell data-mt="5"> */}
          {/*     <h2 data-stack="x" data-gap="3" data-fs="base"> */}
          {/*       {t("dashboard.entries.reactions")} */}
          {/*     </h2> */}

          {/*     <ul data-stack="y" data-mt="5" data-gap="5"> */}
          {/*       {loaderData.entries.topReactions.map((reaction) => ( */}
          {/*         <li */}
          {/*           key={reaction.id} */}
          {/*           data-stack="y" */}
          {/*           data-bct="neutral-800" */}
          {/*           data-bwt="hairline" */}
          {/*           data-pt="3" */}
          {/*           data-gap="3" */}
          {/*         > */}
          {/*           <div data-stack="x" data-gap="3"> */}
          {/*             <div className="c-badge" data-variant="primary"> */}
          {/*               {reaction.reactionEffectiveness} / 5 */}
          {/*             </div> */}

          {/*             <div data-color="neutral-500"> */}
          {/*               {t(`entry.reaction.type.value.${reaction.reactionType}`)} */}
          {/*             </div> */}
          {/*           </div> */}

          {/*           <div data-ml="3" data-color="neutral-100"> */}
          {/*             "{reaction.reactionDescription}" */}
          {/*           </div> */}
          {/*         </li> */}
          {/*       ))} */}
          {/*     </ul> */}
          {/*   </Components.DashboardCell> */}
          {/* )} */}
        </section>

        <section data-fs="sm" {...UI.Rhythm(450).times(1).style.width}>
          <h2 data-stack="x" data-cross="center" data-gap="3" data-fw="regular" data-fs="base">
            <Icons.Calendar data-size="md" data-color="brand-300" /> {t("dashboard.weekly_reviews.header")}
          </h2>

          <Components.DashboardCell data-mt="3">
            <h2 data-stack="x" data-fs="base">
              {t("dashboard.weekly_reviews.history")}
            </h2>

            {/* {!loaderData.weeklyReviews[0] && ( */}
            {/*   <div data-mt="5" data-fs="sm" data-color="neutral-400"> */}
            {/*     {t("dashboard.weekly_reviews.empty")} */}
            {/*   </div> */}
            {/* )} */}

            {/* {loaderData.weeklyReviews[0] && ( */}
            {/*   <ul data-stack="y" data-gap="8" data-mt="5"> */}
            {/*     {loaderData.weeklyReviews.map((review) => ( */}
            {/*       <li key={review.id} data-stack="y" data-gap="5"> */}
            {/*         <div data-stack="x" data-cross="center" data-gap="4" data-color="neutral-500"> */}
            {/*           <div data-mr="auto"> */}
            {/*             {review.week[0]} - {review.week[1]} */}
            {/*           </div> */}
            {/*           {review.status === "completed" && ( */}
            {/*             <> */}
            {/*               <a */}
            {/*                 href={`${import.meta.env.VITE_API_URL}/weekly-review/${review.id}/export/download`} */}
            {/*                 download */}
            {/*                 target="_blank" */}
            {/*                 rel="noopener noreferer" */}
            {/*                 data-pt="2" */}
            {/*                 data-color="brand-500" */}
            {/*               > */}
            {/*                 <Icons.DownloadCircle data-size="lg" /> */}
            {/*               </a> */}

            {/*               <RR.Form method="POST" action="."> */}
            {/*                 <input type="hidden" name="intent" value="export_weekly_review_by_email" /> */}
            {/*                 <input type="hidden" name="weeklyReviewId" value={review.id} /> */}
            {/*                 <button */}
            {/*                   type="submit" */}
            {/*                   className="c-button" */}
            {/*                   data-variant="bare" */}
            {/*                   data-pt="2" */}
            {/*                   data-color="brand-500" */}
            {/*                 > */}
            {/*                   <Icons.SendMail data-size="lg" /> */}
            {/*                 </button> */}
            {/*               </RR.Form> */}
            {/*             </> */}
            {/*           )} */}
            {/*           <div className="c-badge" data-variant="outline"> */}
            {/*             {t(`dashboard.weekly_review.status.${review.status}.value`)} */}
            {/*           </div> */}
            {/*         </div> */}

            {/*         <div data-stack="x" data-gap="2" data-fs="sm"> */}
            {/*           <div className="c-badge" data-variant="primary"> */}
            {/*             {review.entryCount} */}
            {/*           </div> */}
            {/*           {t("dashboard.weekly_review.entries.count")} */}
            {/*         </div> */}

            {/*         {review.status === "completed" && ( */}
            {/*           <div data-stack="y" data-gap="3"> */}
            {/*             <div data-fs="base">{t("dashboard.weekly_review.entries.patterns")}:</div> */}

            {/*             <ul data-stack="y" data-gap="2"> */}
            {/*               {review.patternDetections.map((pattern) => ( */}
            {/*                 <li key={pattern.id} data-fs="sm" data-color="neutral-300"> */}
            {/*                   - {t(`pattern.${pattern.name}.name`)} */}
            {/*                 </li> */}
            {/*               ))} */}
            {/*             </ul> */}
            {/*           </div> */}
            {/*         )} */}

            {/*         {review.status === "completed" && ( */}
            {/*           <div data-stack="y" data-gap="3"> */}
            {/*             <div data-fs="base">{t("dashboard.weekly_review.entries.alarms")}:</div> */}

            {/*             <ul data-stack="y" data-gap="2"> */}
            {/*               {review.alarms.map((alarm) => ( */}
            {/*                 <li key={alarm.id} data-fs="sm" data-color="neutral-300"> */}
            {/*                   - {t(`alarm.name.${alarm.name}`)} */}
            {/*                 </li> */}
            {/*               ))} */}
            {/*             </ul> */}
            {/*           </div> */}
            {/*         )} */}

            {/*         {review.status === "completed" && ( */}
            {/*           <div data-stack="y" data-gap="3"> */}
            {/*             <div data-fs="base">{t("dashboard.weekly_review.insights")}:</div> */}

            {/*             <div data-color="neutral-100"> */}
            {/*               <Icons.Sparks data-size="sm" data-color="brand-100" data-mr="1" /> " */}
            {/*               {review.insights}" */}
            {/*             </div> */}
            {/*           </div> */}
            {/*         )} */}
            {/*       </li> */}
            {/*     ))} */}
            {/*   </ul> */}
            {/* )} */}
          </Components.DashboardCell>
        </section>
      </div>
    </main>
  );
}
