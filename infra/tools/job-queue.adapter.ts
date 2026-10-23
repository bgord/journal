import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort; Mailer: bg.MailerPort };

type AcceptedJob = bg.System.Jobs.SendEmailJobType;

export async function createJobQueue(
  Env: EnvironmentResultType,
  deps: Dependencies,
): Promise<{
  JobQueue: bg.JobQueuePort<AcceptedJob>;
  JobDispatcher: bg.JobDispatcherPort<AcceptedJob>;
  JobQueueStatsProvider: bg.JobQueueStatsProviderPort;
  JobPruner: bg.JobPrunerPort;
}> {
  const store = new bg.JobQueueSqliteStore({ database: "jobs.db" });
  await new bg.JobRecovererSqliteAdapter({ db: store.db }).recover();

  const registry = new bg.JobRegistryAdapter<AcceptedJob>({
    [bg.System.Jobs.SEND_EMAIL_JOB]: {
      schema: bg.System.Jobs.SendEmailJobSchema,
      retry: new bg.JobRetryPolicyCompositeStrategy([
        new bg.JobRetryPolicyLimitStrategy(tools.Int.nonNegative(3)),
        new bg.JobRetryPolicyBackoffStrategy(new bg.RetryBackoffLinearStrategy(tools.Duration.Minutes(1))),
      ]),
      handler: bg.System.JobHandlers.SendEmailJobHandler(deps),
    },
  });

  const JobQueue = new bg.JobQueueAdapter<AcceptedJob>({
    registry,
    enqueuer: new bg.JobEnqueuerSqliteAdapter({ db: store.db, ...deps }),
    claimer: new bg.JobClaimerSqliteAdapter({ db: store.db, ...deps }),
    completer: new bg.JobCompleterSqliteAdapter({ db: store.db }),
    failer: new bg.JobFailerSqliteAdapter({ db: store.db }),
    requeuer: new bg.JobRequeuerSqliteAdapter({ db: store.db, ...deps }),
    serializer: new bg.PayloadSerializerJsonAdapter(),
  });

  const EnvironmentJobQueue = {
    [bg.NodeEnvironmentEnum.local]: JobQueue,
    [bg.NodeEnvironmentEnum.test]: new bg.JobQueueAdapterNoop<AcceptedJob>({ registry }),
    [bg.NodeEnvironmentEnum.staging]: JobQueue,
    [bg.NodeEnvironmentEnum.production]: JobQueue,
  }[Env.type];

  return {
    JobQueue: EnvironmentJobQueue,
    JobDispatcher: EnvironmentJobQueue,

    JobQueueStatsProvider: {
      [bg.NodeEnvironmentEnum.local]: new bg.JobQueueStatsProviderNoopAdapter(),
      [bg.NodeEnvironmentEnum.test]: new bg.JobQueueStatsProviderNoopAdapter(),
      [bg.NodeEnvironmentEnum.staging]: new bg.JobQueueStatsProviderNoopAdapter(),
      [bg.NodeEnvironmentEnum.production]: new bg.JobQueueStatsProviderSqliteAdapter(store),
    }[Env.type],

    JobPruner: {
      [bg.NodeEnvironmentEnum.local]: new bg.JobPrunerNoopAdapter(),
      [bg.NodeEnvironmentEnum.test]: new bg.JobPrunerNoopAdapter(),
      [bg.NodeEnvironmentEnum.staging]: new bg.JobPrunerNoopAdapter(),
      [bg.NodeEnvironmentEnum.production]: new bg.JobPrunerSqliteAdapter({ db: store.db, ...deps }),
    }[Env.type],
  };
}
