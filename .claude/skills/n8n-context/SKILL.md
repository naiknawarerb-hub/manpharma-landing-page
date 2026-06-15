---
description: Caveman context loader for ManPharma n8n automation. Loads all project context in one shot — token saver. Use at start of every new chat.
---

# n8n Context Loader (Caveman Skill)

Load karo, samjho, "done" bolo. Bas.

## Steps

1. Read the context file:

```bash
cat /home/user/manpharma-landing-page/.claude/context/n8n-context.md
```

2. Read current n8n status:

```bash
ps aux | grep n8n | grep -v grep && curl -s http://localhost:5678/healthz 2>/dev/null || echo "n8n not running"
```

3. Output a ONE-LINE status summary to the user in this format:
```
✅ Context loaded | n8n: [running/stopped] | Branch: claude/open-source-automation-options-na6yn0 | Done.
```

That's it. No explanations. No summaries. Just load and say done.
