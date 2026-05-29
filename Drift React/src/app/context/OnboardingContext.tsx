import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserContext, UserContextInput } from '../../lib/userContext';
import { buildWorkStyle, parseWorkStyle } from '../../lib/userContext';

export interface OnboardingDraft {
  priorities: string[];
  otherPriority: string;
  chronotype: string | null;
  focus: string | null;
  tendencies: string[];
  focusDays: string[];
  freeText: string;
}

const emptyDraft: OnboardingDraft = {
  priorities: [],
  otherPriority: '',
  chronotype: null,
  focus: null,
  tendencies: [],
  focusDays: [],
  freeText: '',
};

interface OnboardingContextType {
  draft: OnboardingDraft;
  setPriorities: (priorities: string[], otherPriority?: string) => void;
  setRhythm: (chronotype: string, focus: string, tendencies: string[]) => void;
  setSchedule: (focusDays: string[], freeText: string) => void;
  loadFromUserContext: (ctx: UserContext) => void;
  toUserContextInput: (override?: Partial<OnboardingDraft>) => UserContextInput;
  resetDraft: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(emptyDraft);

  const setPriorities = useCallback((priorities: string[], otherPriority?: string) => {
    setDraft((d) => ({
      ...d,
      priorities,
      otherPriority: otherPriority !== undefined ? otherPriority : d.otherPriority,
    }));
  }, []);

  const setRhythm = useCallback(
    (chronotype: string, focus: string, tendencies: string[]) => {
      setDraft((d) => ({ ...d, chronotype, focus, tendencies }));
    },
    []
  );

  const setSchedule = useCallback((focusDays: string[], freeText: string) => {
    setDraft((d) => ({ ...d, focusDays, freeText }));
  }, []);

  const loadFromUserContext = useCallback((ctx: UserContext) => {
    const { chronotype, focus } = parseWorkStyle(ctx.work_style);
    setDraft({
      priorities: ctx.priorities ?? [],
      otherPriority: ctx.other_priority ?? '',
      chronotype: chronotype || null,
      focus: focus || null,
      tendencies: ctx.tendencies ?? [],
      focusDays: ctx.focus_days ?? [],
      freeText: ctx.free_text ?? '',
    });
  }, []);

  const toUserContextInput = useCallback(
    (override?: Partial<OnboardingDraft>): UserContextInput => {
      const d = override ? { ...draft, ...override } : draft;
      const work_style =
        d.chronotype && d.focus ? buildWorkStyle(d.chronotype, d.focus) : null;
      return {
        priorities: d.priorities,
        other_priority: d.priorities.includes('Other')
          ? d.otherPriority.trim() || null
          : null,
        work_style,
        tendencies: d.tendencies,
        focus_days: d.focusDays,
        free_text: d.freeText.trim() || null,
      };
    },
    [draft]
  );

  const resetDraft = useCallback(() => setDraft(emptyDraft), []);

  return (
    <OnboardingContext.Provider
      value={{
        draft,
        setPriorities,
        setRhythm,
        setSchedule,
        loadFromUserContext,
        toUserContextInput,
        resetDraft,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboardingContext must be used within OnboardingProvider');
  return ctx;
}
