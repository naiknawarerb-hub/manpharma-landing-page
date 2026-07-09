import cron from 'node-cron';
import { config } from './config.js';
import { runDailyBatch } from './agents/orchestrator.js';
import { runRepo } from './db.js';

let jobs = [];

/** Start the cron jobs. No-op if the scheduler is disabled in config. */
export function startScheduler() {
  if (!config.scheduler.enabled) {
    console.log('[scheduler] disabled (ENABLE_SCHEDULER=false)');
    return;
  }
  if (!cron.validate(config.scheduler.dailyCron)) {
    console.error(`[scheduler] invalid DAILY_CRON "${config.scheduler.dailyCron}", scheduler not started`);
    return;
  }

  const daily = cron.schedule(config.scheduler.dailyCron, async () => {
    console.log('[scheduler] running daily content batch…');
    try {
      const results = await runDailyBatch({ count: config.scheduler.dailyIdeaCount });
      console.log(`[scheduler] daily batch produced ${results.length} drafts`);
    } catch (err) {
      console.error('[scheduler] daily batch failed:', err.message);
      runRepo.log('scheduler_error', { message: err.message });
    }
  });

  jobs.push(daily);
  console.log(`[scheduler] started — daily batch at cron "${config.scheduler.dailyCron}" (${config.scheduler.dailyIdeaCount} ideas/run)`);
}

export function stopScheduler() {
  jobs.forEach((j) => j.stop());
  jobs = [];
}
