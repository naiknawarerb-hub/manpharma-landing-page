// 50 Viral Hook Prompts — 10 categories x 5 prompts.
// Source: "50 Viral Hook Prompts (Claude / ChatGPT)" by @ankush_ai_growth.
// Each prompt uses [TOPIC], [AUDIENCE], and [NICHE] placeholders that the hook
// agent fills in from the channel config before sending to Claude.

export const HOOK_CATEGORIES = [
  {
    id: 'curiosity',
    name: 'Curiosity Hooks',
    tagline: 'Open a loop the brain has to close.',
    prompts: [
      { id: 1, name: 'The Open Loop', text: "Act as a viral hook writer. Write 10 curiosity-gap hooks about [TOPIC] that tease a surprising outcome but hide the 'how'. Keep each under 12 words and end on an unfinished thought. Number them." },
      { id: 2, name: 'The Forbidden Reveal', text: 'Generate 10 hooks for [TOPIC] framed as a secret most people never share. Each should imply insider access and withhold the payoff. Make 5 calm, 5 urgent. List them.' },
      { id: 3, name: 'The Specific Mystery', text: "Write 10 hooks for [TOPIC] built on an oddly specific detail — a number, time, or object that demands explanation (e.g. 'I cut 1 word and 3x'd replies'). Numbered list." },
      { id: 4, name: 'The Question Trap', text: "Create 10 question hooks for [TOPIC] the reader can't answer but desperately wants to. No yes/no questions. Each should expose a gap in their knowledge. Number them." },
      { id: 5, name: "The 'What If' Spiral", text: "Produce 10 'what if' hooks for [TOPIC] that flip a common assumption and open a loop (e.g. 'What if the thing you trust most is why X fails?'). Keep them short." },
    ],
  },
  {
    id: 'storytelling',
    name: 'Storytelling Hooks',
    tagline: 'Drop them into the middle of a scene.',
    prompts: [
      { id: 6, name: 'The Cold Open', text: "Act as a story-driven writer. Write 10 first-line hooks about [TOPIC] that start mid-scene with zero setup (e.g. 'The email came at 2am. I read it twice.'). Each under 15 words." },
      { id: 7, name: 'The Transformation Tease', text: 'Generate 10 before/after hooks for [TOPIC] that name a low starting point and hint at a dramatic result — without revealing the steps. One line each, numbered.' },
      { id: 8, name: 'The Costly Mistake', text: 'Write 10 hooks where the narrator admits a specific failure tied to [TOPIC] and what it cost them. Make the stakes concrete — money, time, a person. Number them.' },
      { id: 9, name: 'The Mentor Moment', text: 'Create 10 hooks built around one short line someone once told the narrator about [TOPIC] that changed everything. Keep the quote tight and the framing intriguing.' },
      { id: 10, name: 'The Unexpected Turn', text: "Produce 10 hooks for [TOPIC] that set an expectation in the first half and break it in the second (e.g. 'I did everything right. It still failed.'). One line each." },
    ],
  },
  {
    id: 'contrarian',
    name: 'Contrarian Hooks',
    tagline: 'Attack the thing everyone agrees on.',
    prompts: [
      { id: 11, name: 'The Sacred Cow', text: "Act as a contrarian thought leader. Write 10 hooks for [TOPIC] that challenge a widely accepted 'best practice' and argue the opposite. Confident, not edgy for its own sake. Number them." },
      { id: 12, name: 'The Stop Doing', text: "Generate 10 'stop doing X' hooks for [TOPIC] that frame a popular habit as the real problem. Make each specific to [AUDIENCE]. List them." },
      { id: 13, name: 'The Overrated Take', text: 'Write 10 hooks declaring something the [NICHE] world loves is overrated, then promise a better alternative. Keep the claim bold and defensible. Number them.' },
      { id: 14, name: 'The Myth Buster', text: 'Create 10 hooks for [TOPIC] that name a common myth and flatly reject it, promising the truth underneath. One line each, numbered.' },
      { id: 15, name: 'The Uncomfortable Truth', text: 'Produce 10 hooks stating an uncomfortable truth about [TOPIC] that [AUDIENCE] avoids admitting. Honest, not cruel. Number them.' },
    ],
  },
  {
    id: 'authority',
    name: 'Authority Hooks',
    tagline: 'Lead with proof, then promise the lesson.',
    prompts: [
      { id: 16, name: 'The Earned Credibility', text: "Act as a personal-brand strategist. Write 10 authority hooks for [TOPIC] that open with a specific result or experience ('After X years / X clients / $X'), then promise the lesson. Number them." },
      { id: 17, name: 'The Insider View', text: 'Generate 10 hooks positioning the writer as someone with rare access to [TOPIC], sharing what outsiders never see. Grounded and specific to [NICHE].' },
      { id: 18, name: "The Tested-It-So-You-Don't", text: 'Write 10 hooks where the narrator has personally tested many options in [TOPIC] and distilled the winner. Emphasize the effort saved. List them.' },
      { id: 19, name: 'The Bold Prediction', text: 'Create 10 authority hooks making a confident prediction about the future of [NICHE], backed by an implied track record. One line each, numbered.' },
      { id: 20, name: 'The Framework Drop', text: 'Produce 10 hooks that name a proprietary method for [TOPIC] (give each a memorable 2–3 word name) and promise to break it down. List name + hook.' },
    ],
  },
  {
    id: 'educational',
    name: 'Educational Hooks',
    tagline: 'Promise a skill, faster than they expect.',
    prompts: [
      { id: 21, name: 'The Skill Shortcut', text: "Act as an educational writer. Write 10 hooks for [TOPIC] promising to teach a valuable skill faster than expected (e.g. 'Learn X in one coffee'). Number them." },
      { id: 22, name: 'The Hidden Mechanism', text: 'Generate 10 hooks that promise to explain WHY something in [TOPIC] actually works — not just what to do. Frame it as the missing explanation. List them.' },
      { id: 23, name: 'The Step Reveal', text: "Write 10 hooks promising a clear number of steps to an outcome in [NICHE] ('3 steps to X'). Choose numbers that feel achievable. One line each." },
      { id: 24, name: 'The Mistake-to-Fix', text: "Create 10 educational hooks naming a common mistake in [TOPIC] and promising the exact fix. Format: 'You're doing X wrong. Here's the fix.' Number them." },
      { id: 25, name: 'The Cheat Sheet', text: 'Produce 10 hooks framing the content as a save-worthy reference for [TOPIC] — a checklist, swipe file, or cheat sheet worth bookmarking. List them.' },
    ],
  },
  {
    id: 'emotional',
    name: 'Emotional Hooks',
    tagline: 'Name the feeling before you solve it.',
    prompts: [
      { id: 26, name: 'The Quiet Fear', text: 'Act as an empathetic copywriter. Write 10 hooks for [TOPIC] that name a private fear [AUDIENCE] rarely admits, then offer relief. Warm, never manipulative. Number them.' },
      { id: 27, name: 'The Permission Slip', text: "Generate 10 hooks that give the reader permission to feel or do something about [TOPIC] they've felt guilty about. Lead with reassurance. List them." },
      { id: 28, name: 'The Shared Struggle', text: "Write 10 'it's not just you' hooks for [TOPIC] that name a frustration and create instant belonging. One line each, numbered." },
      { id: 29, name: 'The Hope Spark', text: 'Create 10 hopeful hooks for [TOPIC] that acknowledge a hard situation and promise it can change — without toxic positivity. List them.' },
      { id: 30, name: 'The Identity Mirror', text: "Produce 10 hooks describing [AUDIENCE]'s identity so accurately they feel seen (e.g. 'If you reopen the same draft 9 times, this is for you.'). Number them." },
    ],
  },
  {
    id: 'data',
    name: 'Data & Statistics Hooks',
    tagline: 'Let a number do the stopping.',
    prompts: [
      { id: 31, name: 'The Shocking Stat', text: 'Act as a data-driven writer. Write 10 hooks for [TOPIC] built on a surprising statistic. Use plausible placeholder numbers in [brackets] for me to verify. Number them.' },
      { id: 32, name: 'The Comparison Number', text: "Generate 10 hooks comparing two numbers in [NICHE] to create contrast (e.g. '90% do X. The 10% who do Y win.'). List them." },
      { id: 33, name: 'The Cost of Inaction', text: 'Write 10 hooks quantifying what [AUDIENCE] loses by ignoring [TOPIC] — time, money, opportunities. Keep figures placeholder-bracketed. Number them.' },
      { id: 34, name: 'The Tiny-Change Result', text: "Create 10 hooks pairing a small input with an outsized measurable result for [TOPIC] (e.g. 'One change → [X]% lift'). One line each." },
      { id: 35, name: 'The Benchmark Reveal', text: "Produce 10 hooks that reveal a benchmark or average in [NICHE] and position the reader against it (e.g. 'Most X is [number]. Here's how to beat it.'). List them." },
    ],
  },
  {
    id: 'pain',
    name: 'Problem & Pain Hooks',
    tagline: 'Say their pain in their own words.',
    prompts: [
      { id: 36, name: 'The Name-the-Pain', text: "Act as a direct-response copywriter. Write 10 hooks that name a sharp, specific pain point in [TOPIC] in the reader's own words. No vague phrasing. Number them." },
      { id: 37, name: 'The Symptom Spotlight', text: "Generate 10 hooks naming a tell-tale symptom of a deeper problem in [NICHE] (e.g. 'If X keeps happening, the real issue is Y.'). List them." },
      { id: 38, name: 'The Wasted Effort', text: 'Write 10 hooks for [TOPIC] highlighting effort [AUDIENCE] wastes on the wrong thing, then hint at the right thing. One line each, numbered.' },
      { id: 39, name: 'The Frustration Loop', text: 'Create 10 hooks describing a frustrating cycle in [TOPIC] the reader keeps repeating, and tease the way out. List them.' },
      { id: 40, name: 'The Dream-Blocker', text: 'Produce 10 hooks naming the one obstacle between [AUDIENCE] and their goal in [NICHE]. Make the blocker feel solvable. Number them.' },
    ],
  },
  {
    id: 'urgency',
    name: 'FOMO & Urgency Hooks',
    tagline: 'Make standing still feel expensive.',
    prompts: [
      { id: 41, name: 'The Closing Window', text: 'Act as a launch copywriter. Write 10 urgency hooks for [TOPIC] built on a genuinely time-sensitive shift — a trend, deadline, or season. No fake scarcity. Number them.' },
      { id: 42, name: 'The Early-Mover Edge', text: 'Generate 10 hooks framing [TOPIC] as an advantage available only to those who act before the crowd. List them.' },
      { id: 43, name: 'The While-You-Wait Cost', text: 'Write 10 hooks showing what peers gain while the reader hesitates on [TOPIC]. One line each, numbered.' },
      { id: 44, name: 'The Trend Catch', text: 'Create 10 hooks tying [TOPIC] to a rising trend in [NICHE] and urging the reader to ride it now. Keep them current and specific. List them.' },
      { id: 45, name: 'The Last-Chance Reframe', text: 'Produce 10 hooks that reframe an ordinary moment as a rare opportunity in [TOPIC] — without dishonest pressure. Number them.' },
    ],
  },
  {
    id: 'cta',
    name: 'CTA & Engagement Hooks',
    tagline: 'Turn the scroll into a reply.',
    prompts: [
      { id: 46, name: 'The Comment Trigger', text: "Act as an engagement strategist. Write 10 hooks for [TOPIC] that lead naturally to a one-word comment CTA (e.g. comment 'X' to get Y). Make the ask feel worth it. Number them." },
      { id: 47, name: 'The Save-Bait', text: "Generate 10 hooks for [TOPIC] that promise reference-worthy value so the reader saves the post. End each with an implicit 'save this'. List them." },
      { id: 48, name: 'The Tag-a-Friend', text: 'Write 10 hooks for [TOPIC] designed so the reader instantly pictures one specific person to tag. One line each, numbered.' },
      { id: 49, name: 'The Poll / Pick', text: "Create 10 hooks for [TOPIC] that pose a 'this or that' choice inviting the reader to reply with their pick. List them." },
      { id: 50, name: 'The Hot-Take Invite', text: 'Produce 10 hooks stating a debatable opinion on [TOPIC] and explicitly inviting agreement or pushback in the comments. Number them.' },
    ],
  },
];

/** Flat list of all 50 prompts, each tagged with its category. */
export const ALL_HOOK_PROMPTS = HOOK_CATEGORIES.flatMap((cat) =>
  cat.prompts.map((p) => ({ ...p, categoryId: cat.id, categoryName: cat.name }))
);

/** Fill [TOPIC]/[AUDIENCE]/[NICHE] placeholders in a prompt. */
export function fillHookPrompt(promptText, { topic, audience, niche }) {
  return promptText
    .replaceAll('[TOPIC]', topic || '[TOPIC]')
    .replaceAll('[AUDIENCE]', audience || '[AUDIENCE]')
    .replaceAll('[NICHE]', niche || '[NICHE]');
}

/** Look up a category by id, or return the first one as a safe default. */
export function getCategory(categoryId) {
  return HOOK_CATEGORIES.find((c) => c.id === categoryId) || HOOK_CATEGORIES[0];
}
