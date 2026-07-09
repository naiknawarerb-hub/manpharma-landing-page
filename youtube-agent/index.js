import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config, hasClaude } from './src/config.js';
import { router as api } from './src/routes/api.js';
import { startScheduler } from './src/scheduler.js';
import './src/db.js'; // initialize schema on boot

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.json({ ok: true, claude: hasClaude }));
app.use('/api', api);

app.listen(config.port, () => {
  console.log('\n🎬  YouTube AI Agent');
  console.log(`    Dashboard : http://localhost:${config.port}`);
  console.log(`    Channel   : ${config.channel.name} (${config.channel.niche})`);
  console.log(`    Claude    : ${hasClaude ? `configured (${config.claudeModel})` : 'NOT set — running in template fallback mode'}`);
  startScheduler();
  console.log('');
});
