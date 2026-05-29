import { supabase } from './supabase';

export interface UserContext {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  priorities: string[];
  other_priority: string | null;
  work_style: string | null;
  tendencies: string[];
  focus_days: string[];
  free_text: string | null;
}

export type UserContextInput = Pick<
  UserContext,
  'priorities' | 'other_priority' | 'work_style' | 'tendencies' | 'focus_days' | 'free_text'
>;

export function formatPriorityLabel(
  priority: string,
  otherPriority: string | null
): string {
  if (priority === 'Other' && otherPriority?.trim()) {
    return otherPriority.trim();
  }
  return priority;
}

export type UpsertUserContextResult = {
  data: UserContext | null;
  error: string | null;
};

export async function fetchUserContext(): Promise<UserContext | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_context')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as UserContext;
}

export async function upsertUserContext(
  input: UserContextInput
): Promise<UpsertUserContextResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: 'Not signed in' };
  }

  const row = {
    user_id: user.id,
    priorities: input.priorities,
    other_priority: input.other_priority,
    work_style: input.work_style,
    tendencies: input.tendencies,
    focus_days: input.focus_days,
    free_text: input.free_text,
  };

  const { error: upsertError } = await supabase
    .from('user_context')
    .upsert(row, { onConflict: 'user_id' });

  if (upsertError) {
    console.error('Failed to save user_context:', upsertError);
    return { data: null, error: upsertError.message };
  }

  const saved = await fetchUserContext();
  if (!saved) {
    return {
      data: null,
      error:
        'Saved to database but could not load your profile. Check that the user_context table exists and RLS policies are applied.',
    };
  }
  return { data: saved, error: null };
}

export function buildWorkStyle(chronotype: string, focus: string): string {
  return `${chronotype}, ${focus}`;
}

export function parseWorkStyle(workStyle: string | null): { chronotype: string; focus: string } {
  if (!workStyle) return { chronotype: '', focus: '' };
  const commaIdx = workStyle.indexOf(', ');
  if (commaIdx === -1) return { chronotype: workStyle, focus: '' };
  return {
    chronotype: workStyle.slice(0, commaIdx),
    focus: workStyle.slice(commaIdx + 2),
  };
}

export function buildPersonalContextPrompt(ctx: UserContext): string {
  const prioritiesBlock =
    ctx.priorities.length > 0
      ? ctx.priorities
          .map((p, i) => `${i + 1}. ${formatPriorityLabel(p, ctx.other_priority)}`)
          .join('\n')
      : 'Not specified';

  const tendenciesBlock =
    ctx.tendencies.length > 0
      ? ctx.tendencies.map((t) => `- ${t}`).join('\n')
      : '- Not specified';

  const focusDays =
    ctx.focus_days.length > 0 ? ctx.focus_days.join(', ') : 'Not specified';

  const scheduleNotes = ctx.free_text?.trim()
    ? `\nAdditional schedule notes:\n${ctx.free_text.trim()}`
    : '';

  const workStyle = ctx.work_style?.trim() || 'Not specified';

  return `
You are the prioritisation engine for Drift, a task app for people with high cognitive overload.

Here is the user's personal context:

LIFE PRIORITIES (in order):
${prioritiesBlock}

WEEKLY RHYTHM:
- Focus days for deep work: ${focusDays}${scheduleNotes}

WORKING STYLE:
- ${workStyle}
${tendenciesBlock}

MODE CALIBRATION (user-selected per pick):
- DEEP — time and focus for meaningful tasks that move priorities forward
- QUICK — fast win: prefer shorter, easier tasks when priorities allow
`;
}
