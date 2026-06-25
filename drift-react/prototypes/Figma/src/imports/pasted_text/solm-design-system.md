Figma Make prompt: Solm design system update — light/dark mode + accessibility
Context: The current Figma prototypes are dark-only with hardcoded hex values (e.g. #0c0c0c, #2e2e2e, #555, #ffffff selected borders). The shipped app now uses a semantic token system with Light and Dark modes, WCAG AA 4.5:1 contrast on all text levels, and a few new UI patterns. Update all screens to use variables/modes — do not keep hardcoded dark-only colors.

Font: DM Sans (weights 300, 400, 500). Base size 16px.

App shell: Max width 420px, full viewport height, background uses solm-bg, default text uses solm-text-1.

1. Create Figma variables with two modes: Light and Dark
Name the collection Solm. Every color below should be a variable with Light and Dark values.

Backgrounds & surfaces
Token	Light	Dark	Usage
solm-bg
#fafafa
#0c0c0c
Page background
solm-surface
#f3f3f3
#0f0f0f
Cards, inset panels (e.g. “How it works” cards, sign-in card)
solm-surface-raised
#ffffff
#0c0c0c
Elevated surfaces
solm-overlay-surface
#ffffff
#111111
Overlays/modals if needed
Text hierarchy (all must meet WCAG AA 4.5:1 on solm-bg)
Token	Light	Dark	Usage
solm-text-1
#1a1a1a
#f2f2f2
Headings, primary content, logo
solm-text-2
#4d4d4d
#b3b3b3
Body copy, descriptions, card body
solm-text-3
#5e5e5e
#9e9e9e
Section labels, status text, uppercase labels
solm-text-4
#6e6e6e
#8a8a8a
Muted text, secondary buttons, hints
solm-text-5
#757575
#757575
Subtle/tertiary: back links, footer, placeholders
solm-text-error
#b04040
#d08080
Error messages
solm-text-accent
#8a7040
#b8a070
Accent text (rare)
Important accessibility fix: Prototype labels like #2e2e2e, #252525, #444 on dark backgrounds fail contrast. Replace all of them with the token levels above — never use colors darker than solm-text-3 for readable text.

Borders (interactive scale)
Token	Light	Dark
solm-border
#e0e0e0
#1a1a1a
solm-border-subtle
#ebebeb
#1a1a1a
solm-border-strong
#d4d4d4
#242424
solm-border-muted
#c8c8c8
#2a2a2a
solm-border-hover
#bdbdbd
#333333
solm-border-active
#9e9e9e
#383838
solm-border-selected
#757575
#444444
solm-border-focus
#6e6e6e
#333333
solm-border-emphasis
#1a1a1a
#f2f2f2
Selection state change: Prototype uses white border (#ffffff) for selected chips/buttons. In code, selected state uses solm-border-emphasis — dark border in light mode, light border in dark mode. Text goes to solm-text-1 when selected; unselected chip text is solm-text-4.

CTA (primary action buttons)
Token	Light	Dark
solm-cta-bg
#1a1a1a
#f2f2f2
solm-cta-fg
#fafafa
#0c0c0c
solm-cta-disabled-bg
#e8e8e8
#1a1a1a
solm-cta-disabled-fg
#9e9e9e
#757575
CTA buttons are inverted between modes: dark button on light bg, light button on dark bg. Used for “What’s next?”, “Start”, “Continue with Google”, onboarding Continue, etc.

Phone mockup (Login hero only)
Token	Light	Dark
solm-mockup-bezel
#f5f5f5
#0c0c0c
solm-mockup-ring
#e8e8e8
#111111
solm-mockup-notch
#e0e0e0
#1a1a1a
solm-shadow
rgba(0,0,0,0.12)
rgba(0,0,0,0.7)
Misc
Scrim behind bottom sheet: rgba(0,0,0,0.55) (same in both modes)
Browser chrome theme-color: #fafafa light / #0c0c0c dark
2. Interactive states (apply across all screens)
Primary CTA button (rounded-2xl, py ~20px):

Default: solm-cta-bg fill, solm-cta-fg text
Hover: ~90% opacity
Active/pressed: ~80% opacity
Disabled (no content): solm-cta-disabled-bg / solm-cta-disabled-fg OR 15–20% opacity + not-allowed cursor
Arrow/chevron suffix at 40% opacity
Secondary/outline button (rounded-2xl, border solm-border-strong):

Text: solm-text-4
Hover: border → solm-border-hover or solm-border-muted
Ghost/text links (back, Settings, Privacy):

Default: solm-text-5
Hover: solm-text-2 or solm-text-3
Chip / pill selectors (onboarding rhythm, priorities, schedule days, home mode picker):

Unselected: border solm-border-strong, text solm-text-4, transparent bg
Selected: border solm-border-emphasis, text solm-text-1
Home mode picker selected: border solm-border-selected, text solm-text-2
Text inputs & textareas (rounded-2xl, border solm-border-strong):

Text: solm-text-2 or solm-text-1
Placeholder: solm-text-5
Focus: border → solm-border-focus (no glow ring in app screens)
Add-task screen uses underline style: bottom border solm-border-strong, focus → solm-text-3 color on border
Disabled opacity conventions:

Primary CTA when blocked: 15–20% opacity
Submit while loading: 60% opacity
In-app browser blocks sign-in: 60% opacity
3. New UI components (not in prototypes)
A. Theme toggle (Login nav + Login error)
Position: top-right of Login nav, beside “Sign in”
16×16 icon (sun in dark mode, moon in light mode)
Container: rounded-xl, 8px padding, border solm-border
Icon color: solm-text-4, hover → solm-text-2, border hover → solm-border-hover
Accessible label: “Switch to light mode” / “Switch to dark mode”
B. Appearance setting (Settings — first card, above Priorities)
Section label: “APPEARANCE”, 10px uppercase, solm-text-3, tracking 0.22em
Outer card: rounded-2xl, border solm-border, 20px padding
Segmented control inside: rounded-2xl, border solm-border, 4px inner padding, 3 equal segments
Options: System | Light | Dark
Selected segment: bg solm-surface, border 0.5px solid solm-border-strong, text solm-text-1, weight 400
Unselected: transparent bg, text solm-text-4, weight 300
Segment text: 13px
C. In-app browser banner (Login screens)
Shown above Google sign-in when in embedded browser
rounded-2xl, px 16, py 12, border solm-border, bg solm-surface
Text: 13px, weight 300, solm-text-2, centered
Copy: “Please open this in Safari or Chrome to sign in with Google.”
4. Screen-by-screen token migration
Apply variables to every screen. Key mappings from old prototype hex:

Old prototype	New token
#0c0c0c bg
solm-bg
#fff / #f2f2f2 headings
solm-text-1
#3a3a3a body
solm-text-2
#2e2e2e / #252525 labels
solm-text-3 (brighter — was failing contrast)
#555 / #666 / #888 secondary
solm-text-4 or solm-text-3 by hierarchy
#444 / #1e1e1e tertiary links
solm-text-5
#1a1a1a borders
solm-border
#242424 strong borders
solm-border-strong
#0f0f0f card bg
solm-surface
#f2f2f2 CTA
solm-cta-bg + solm-cta-fg
#ffffff selected border
solm-border-emphasis
#141414 bottom sheet
solm-bg
Login: Replace dark-only layout with token-based layout. Add ThemeToggle in nav. Hero mockup uses mockup tokens. “How it works” cards: solm-surface fill. Secondary sign-in button: outline style on solm-bg. Footer links: solm-text-5.

Home: Loader dots use solm-text-3 (not #2e2e2e). Loading label uses solm-text-5 with animated opacity 0.75–1.0 (not #252525). Add Settings link at bottom (solm-text-5).

Moment picker bottom sheet: Sheet background = solm-bg (not #141414). Drag handle = solm-border-strong. List dividers = solm-border-strong. Selected row text = solm-text-1; unselected = solm-text-4, hover solm-text-2.

Settings: Add Appearance card at top. All section cards use solm-border. Headings solm-text-1. Edit links solm-text-5.

Onboarding (Priorities, Rhythm, Schedule, Welcome, Complete): All chips, inputs, CTAs use token system. Continue button disabled until valid: 20% opacity.

Add task: Disabled CTA uses explicit solm-cta-disabled-* tokens (not just opacity). Keyboard hint solm-text-3.

Working / Next / Done: Same token migration; checkmarks in solm-cta-bg circle.

Privacy: Full token migration for long-form text hierarchy.

Login error: ThemeToggle top-right, error text solm-text-error, same CTA/banner patterns.

5. Light mode visual summary
Light mode is not just an inversion — it’s a distinct palette:

Warm off-white background (#fafafa), not pure white
Dark CTAs (#1a1a1a on #fafafa)
Borders are light grays, clearly visible against #fafafa
Text is dark gray hierarchy, not pure black everywhere
Cards on Login use subtle #f3f3f3 surface against #fafafa page
Create both modes for every frame. Default frame pair: Light + Dark side by side, or use Figma variable mode switching.

6. Accessibility requirements to preserve in Figma
No text below 4.5:1 contrast on its background — use the 5-level hierarchy, don’t invent new grays
Selected states must be distinguishable without relying on color alone — use border weight/color change (solm-border-emphasis) plus text weight/color shift
Focus states on inputs: show solm-border-focus border (document as a component variant)
Error state: solm-text-error only for error copy, not decorative
Decorative icons (Google logo, status bar SVGs, sun/moon) — no text labels needed in design, but annotate as decorative in dev handoff
Theme toggle & appearance control — must have clear visible boundaries (bordered) for touch/keyboard targets (~36px min)
7. What NOT to change
Layout, spacing, typography sizes, motion intent, and copy stay the same
Border radius: rounded-2xl (16px) for cards/buttons, rounded-xl (12px) for smaller controls
Letter-spacing on uppercase labels: 0.2–0.25em
Font weights: headings 300–500, body 300–400
Phone mockup dimensions and structure unchanged — only recolor with mockup tokens
8. Deliverables
Figma variable collection Solm with Light/Dark modes for all tokens above
Updated components: CTA, outline button, chip selector, text input, theme toggle, appearance segmented control, in-app banner
All existing screens re-rendered in both Light and Dark
Component variants for: default, hover, focus, selected, disabled
Remove all hardcoded hex from prototype frames — reference variables only