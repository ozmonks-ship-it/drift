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

export async function pickNextTask(
  tasks: { id: string; description: string }[],
  energy: 'high' | 'medium' | 'low'
): Promise<string | null> {
  if (tasks.length === 0) return null;
  if (tasks.length === 1) return tasks[0].id;

  const taskList = tasks
    .map((t, i) => `${i + 1}. [ID: ${t.id}] ${t.description}`)
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
      max_tokens: 100,
      system: PERSONAL_CONTEXT,
      messages: [
        {
          role: 'user',
          content: `My current energy level is: ${energy.toUpperCase()}

Here are my pending tasks:
${taskList}

Pick the single best task for me to do right now given my energy level and personal context. Reply with ONLY the task ID, nothing else.`,
        },
      ],
    }),
  });

  const data = await response.json();
  const rawId = data.content?.[0]?.text?.trim();

  // Match the returned ID against known task IDs
  const match = tasks.find(t => rawId?.includes(t.id));
  return match?.id ?? tasks[0].id;
}