const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

const PERSONAL_CONTEXT = `
You are the prioritisation engine for Drift, a task app for people with high cognitive overload.

Here is the user's personal context:

WHO THEY ARE:
Father, husband, product manager, surfer and guitarist on 15 weeks parental leave. High cognitive overload — easily distracted, tendency to overload with todos. Goal: be deeply present for family, stay healthy, build first product (Drift).

LIFE PRIORITIES (in order):
1. Family — presence, meals, fridge stocked, Thursday date night
2. Exercise — non-negotiable daily anchor
3. Reading — finish bought books and saved articles
4. Product work (Drift) — learning project, daycare days only
5. Everything else

WEEKLY RHYTHM:
- Daycare days (Mon, Tue, Wed): swim/surf → coffee + reading → cooking + cleaning → product work → guitar
- Non-daycare days (Mon, Thu, Sat, Sun): pilates → family time → guitar
- Thursday evenings: date night, order in

WORKING STYLE:
- Morning person, short focus sprints
- Easily distracted, gets overwhelmed by long lists
- Needs help saying no and cutting scope

ENERGY MAPPING:
- High energy → important, meaningful tasks that move life or product forward
- Medium energy → steady tasks, family admin, reading
- Low energy → quick wins, easy tasks, light admin
`;

export type PickSource = 'claude' | 'fallback' | 'single' | 'empty';

export interface PickResult {
  id: string | null;
  source: PickSource;
}

export async function pickNextTask(
  tasks: { id: string; description: string }[],
  energy: 'high' | 'medium' | 'low'
): Promise<PickResult> {
  if (tasks.length === 0) return { id: null, source: 'empty' };
  if (tasks.length === 1) return { id: tasks[0].id, source: 'single' };

  const taskList = tasks
  .map(t => `[${t.id}] ${t.description}`)
  .join('\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: PERSONAL_CONTEXT,
      messages: [
        {
          role: 'user',
          content: `The current time is ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true })} on ${new Date().toLocaleDateString('en-AU', { weekday: 'long' })}.
My current energy level is: ${energy.toUpperCase()}

Here are my pending tasks:
${taskList}

Pick the single best task for me to do right now given the time, day, my energy level and personal context.

Think through your reasoning briefly, then end your response with:
PICK: [task id]`
        },
      ],
    }),
  });

  const data = await response.json();

  // Match the returned ID against known task IDs
  const text = data.content?.[0]?.text?.trim();
  console.log('Claude reasoning:', text);
  const pickMatch = text?.match(/^\s*\**\s*PICK\s*\**\s*:\s*(.+)$/im);
  const rawId = pickMatch?.[1]?.trim();
  const normalizedRawId = rawId
    ?.replace(/[`*_]/g, '')
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .replace(/^["']/, '')
    .replace(/["']$/, '')
    .trim();

  const match =
    tasks.find(t => String(t.id) === String(normalizedRawId)) ??
    tasks.find(t => String(t.id).toLowerCase() === String(normalizedRawId).toLowerCase());

  const pickLine = pickMatch?.[0];
  console.log('Raw pick line:', pickLine);
  console.log('Raw ID extracted:', JSON.stringify(rawId));
  console.log('Normalized ID extracted:', JSON.stringify(normalizedRawId));
  console.log('Available task IDs:', tasks.map(t => t.id));
  if (!match) {
    console.warn('Claude PICK did not match any known task id; falling back to oldest pending task');
  }
  return { id: match?.id ?? tasks[0].id, source: match ? 'claude' : 'fallback' };
}