const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let API_KEY = localStorage.getItem('yt_api_key') || '';

async function api(pathName, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['x-api-key'] = API_KEY;
  const res = await fetch('/api' + pathName, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    const key = prompt('This server is protected. Enter the API_KEY:');
    if (key) { API_KEY = key; localStorage.setItem('yt_api_key', key); return api(pathName, { method, body }); }
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1600);
}

function sourcePill(source) {
  const cls = source === 'claude' ? 'claude' : 'fallback';
  const label = source === 'claude' ? 'Claude' : 'template';
  return `<span class="pill ${cls}">${label}</span>`;
}

function busy(btn, on) {
  btn.disabled = on;
  if (on) { btn.dataset.label = btn.textContent; btn.innerHTML = '<span class="spinner"></span>'; }
  else if (btn.dataset.label) { btn.textContent = btn.dataset.label; }
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
$$('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    $$('.tab').forEach((t) => t.classList.remove('active'));
    $$('.panel').forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    $('#tab-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'library') loadLibrary();
    if (tab.dataset.tab === 'activity') loadRuns();
  });
});

// Copy-on-click for list items.
document.addEventListener('click', (e) => {
  const el = e.target.closest('.copyable');
  if (el) { navigator.clipboard.writeText(el.dataset.copy || el.textContent).then(() => toast('Copied')); }
});

// ── Status / init ────────────────────────────────────────────────────────────
async function init() {
  try {
    const s = await api('/status');
    $('#channelLine').textContent = `${s.channel.name} · ${s.channel.niche}`;
    const badge = $('#claudeBadge');
    if (s.claude === 'configured') { badge.textContent = `Claude · ${s.model}`; badge.className = 'badge ok'; }
    else { badge.textContent = 'Template mode (no API key)'; badge.className = 'badge warn'; }

    const cats = await api('/hooks/categories');
    const opts = cats.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    $('#genHookCategory').innerHTML = opts;
    $('#hookCategory').innerHTML = opts;

    $('#schedInfo').innerHTML = s.scheduler.enabled
      ? `Scheduler <b>on</b> — daily batch at cron <code>${esc(s.scheduler.dailyCron)}</code>, ${s.scheduler.dailyIdeaCount} ideas/run.`
      : 'Scheduler is <b>off</b>.';
  } catch (err) {
    $('#claudeBadge').textContent = 'offline';
  }
}

// ── Generate: ideas ──────────────────────────────────────────────────────────
$('#ideasBtn').addEventListener('click', async (e) => {
  busy(e.target, true);
  try {
    const { ideas } = await api('/ideas', { method: 'POST', body: { count: 4, seedTopic: $('#genTopic').value || null } });
    $('#ideasOut').innerHTML = ideas.map((i) =>
      `<span class="chip" data-topic="${esc(i.topic)}" data-angle="${esc(i.angle || '')}" data-format="${esc(i.format || 'explainer')}">💡 ${esc(i.topic)}</span>`
    ).join('');
    $$('#ideasOut .chip').forEach((chip) => chip.addEventListener('click', () => {
      $('#genTopic').value = chip.dataset.topic;
      $('#genAngle').value = chip.dataset.angle;
      if (chip.dataset.format) $('#genFormat').value = chip.dataset.format;
    }));
  } catch (err) { toast(err.message); }
  busy(e.target, false);
});

// ── Generate: full pipeline ──────────────────────────────────────────────────
$('#genBtn').addEventListener('click', async (e) => {
  const topic = $('#genTopic').value.trim();
  if (!topic) return toast('Enter a topic first');
  busy(e.target, true);
  $('#genResult').innerHTML = '<div class="empty"><span class="spinner"></span> Running 5 agents…</div>';
  try {
    const { content, sources } = await api('/generate', { method: 'POST', body: {
      topic,
      angle: $('#genAngle').value.trim(),
      format: $('#genFormat').value,
      hookCategory: $('#genHookCategory').value,
      lengthMinutes: Number($('#genLength').value) || 6,
    }});
    $('#genResult').innerHTML = renderContent(content, sources);
  } catch (err) {
    $('#genResult').innerHTML = `<div class="empty">⚠ ${esc(err.message)}</div>`;
  }
  busy(e.target, false);
});

// ── Hooks tab ────────────────────────────────────────────────────────────────
async function runHooks(categoryId) {
  const topic = $('#hookTopic').value.trim();
  if (!topic) return toast('Enter a topic first');
  $('#hookResult').innerHTML = '<div class="empty"><span class="spinner"></span> Writing hooks…</div>';
  try {
    const data = await api('/hooks', { method: 'POST', body: { topic, categoryId } });
    $('#hookResult').innerHTML = data.groups.map(renderHookGroup).join('') +
      `<p class="muted" style="margin-top:8px">Generated by ${data.source === 'claude' ? 'Claude' : 'templates (no API key)'} · click any hook to copy</p>`;
  } catch (err) { $('#hookResult').innerHTML = `<div class="empty">⚠ ${esc(err.message)}</div>`; }
}
$('#hookBtn').addEventListener('click', () => runHooks($('#hookCategory').value));
$('#hookMixBtn').addEventListener('click', () => runHooks('mix'));

function renderHookGroup(g) {
  return `<div class="result-card">
    <h3>${esc(g.category)} <span class="pill">${esc(g.promptName)}</span></h3>
    <ul class="clean">${g.hooks.map((h) => `<li class="copyable" data-copy="${esc(h)}">${esc(h)}</li>`).join('')}</ul>
  </div>`;
}

// ── Render a full content record ─────────────────────────────────────────────
function renderContent(c, sources = {}) {
  const s = c.script || {};
  const seo = c.seo || {};
  const hooks = (c.hooks && c.hooks.groups) || [];
  const thumbs = c.thumbnail || [];

  const scriptText = s.hook ? [
    `HOOK: ${s.hook}`,
    ``,
    `INTRO: ${s.intro || ''}`,
    ``,
    ...(s.sections || []).map((sec) =>
      `## ${sec.heading}\n${(sec.talkingPoints || []).map((t) => '  • ' + t).join('\n')}${sec.onScreen ? `\n  [on-screen: ${sec.onScreen}]` : ''}`),
    ``,
    `CTA: ${s.cta || ''}`,
    s.broll && s.broll.length ? `\nB-ROLL: ${s.broll.join(' · ')}` : '',
  ].join('\n') : 'No script.';

  return `<div class="result-card">
    <h3>🎬 ${esc(c.topic)} <span class="pill">${esc(c.format || '')}</span> <span class="pill ${c.status === 'ready' ? 'claude' : ''}">${esc(c.status)}</span></h3>

    <h4>Hooks ${sources.hooks ? sourcePill(sources.hooks) : ''}</h4>
    ${hooks.map((g) => `<ul class="clean">${(g.hooks || []).slice(0, 6).map((h) => `<li class="copyable" data-copy="${esc(h)}">${esc(h)}</li>`).join('')}</ul>`).join('') || '<p class="muted">—</p>'}

    <h4>Titles ${sources.seo ? sourcePill(sources.seo) : ''}</h4>
    <ul class="clean">${(seo.titles || []).map((t) => `<li class="copyable" data-copy="${esc(t)}">${esc(t)}</li>`).join('')}</ul>

    <h4>Script ${sources.script ? sourcePill(sources.script) : ''}</h4>
    <pre class="script copyable" data-copy="${esc(scriptText)}">${esc(scriptText)}</pre>

    <h4>Description</h4>
    <pre class="script copyable" data-copy="${esc(seo.description || '')}">${esc(seo.description || '')}</pre>

    <h4>Tags</h4>
    <div class="tag-list">${(seo.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>

    <h4>Thumbnail concepts ${sources.thumbnail ? sourcePill(sources.thumbnail) : ''}</h4>
    <ul class="clean">${thumbs.map((t) =>
      `<li><b>${esc(t.overlayText || '')}</b> — ${esc(t.visual || '')}<br><span class="muted copyable" data-copy="${esc(t.imagePrompt || '')}">🎨 image prompt (click to copy)</span></li>`
    ).join('')}</ul>

    ${seo.pinnedComment ? `<h4>Pinned comment</h4><p class="copyable" data-copy="${esc(seo.pinnedComment)}">${esc(seo.pinnedComment)}</p>` : ''}
  </div>`;
}

// ── Library ──────────────────────────────────────────────────────────────────
async function loadLibrary() {
  $('#libraryList').innerHTML = '<div class="empty"><span class="spinner"></span></div>';
  try {
    const rows = await api('/content');
    if (!rows.length) { $('#libraryList').innerHTML = '<div class="empty">No content yet. Generate your first video plan!</div>'; return; }
    $('#libraryList').innerHTML = rows.map((c) => `
      <div class="result-card lib-row" data-id="${c.id}">
        <h3>${esc(c.topic)} <span class="pill">${esc(c.status)}</span>
          <span class="meta" style="margin-left:auto">${esc(c.source)} · ${esc(c.created_at)}</span>
        </h3>
        <div class="lib-body">${renderContent(c)}</div>
      </div>`).join('');
    $$('.lib-row').forEach((row) => row.querySelector('h3').addEventListener('click', () => row.classList.toggle('open')));
  } catch (err) { $('#libraryList').innerHTML = `<div class="empty">⚠ ${esc(err.message)}</div>`; }
}
$('#refreshLib').addEventListener('click', loadLibrary);

// ── Activity ─────────────────────────────────────────────────────────────────
async function loadRuns() {
  $('#runsList').innerHTML = '<div class="empty"><span class="spinner"></span></div>';
  try {
    const runs = await api('/runs');
    if (!runs.length) { $('#runsList').innerHTML = '<div class="empty">No runs logged yet.</div>'; return; }
    $('#runsList').innerHTML = '<div class="result-card"><ul class="clean">' +
      runs.map((r) => `<li><b>${esc(r.kind)}</b> <span class="muted">${esc(r.created_at)}</span>${r.detail ? `<br><span class="muted">${esc(JSON.stringify(r.detail))}</span>` : ''}</li>`).join('') +
      '</ul></div>';
  } catch (err) { $('#runsList').innerHTML = `<div class="empty">⚠ ${esc(err.message)}</div>`; }
}
$('#refreshRuns').addEventListener('click', loadRuns);

init();
