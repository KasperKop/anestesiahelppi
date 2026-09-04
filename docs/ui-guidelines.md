# UI and interaction guidelines

This document records the visual direction of the first prototype. The palette is inspired by the original home-screen concept and remains provisional until contrast testing is complete.

## Visual character

- Warm, calm off-white background
- White elevated content surfaces
- Pale blue supporting surfaces
- Clear blue for interactive controls, links and assistant actions
- Near-black text for strong legibility
- Generous spacing, rounded cards and large touch targets

## Semantic color roles

| Role | Provisional token | Intended use |
| --- | --- | --- |
| Canvas | `#F7F3EB` | Warm application background |
| Surface | `#FFFFFF` | Cards, sheets and input areas |
| Supporting surface | `#EAF6FC` | Calm grouping and secondary information |
| Interactive blue | `#2DAAE1` | Buttons, links, focus accents and slider state |
| Primary text | `#202124` | Headings, values and body text |
| Secondary text | `#6B7280` | Timestamps and supporting metadata |
| Critical red | `#D92D20` | Critical warnings and critical checklist information only |

The values are starting points, not approved design tokens. They must be checked in context for WCAG contrast before implementation.

## Reserved use of red

Red is not a general brand or action color. It is reserved for information that is genuinely critical, such as an explicitly identified critical warning in the preparation view.

- The assistant send action uses interactive blue, not red.
- Routine validation and neutral status messages do not use red.
- Critical state always includes text and, when helpful, an icon; color is never the only signal.
- Destructive controls use clear wording and confirmation rather than relying on red alone.

## Home screen

The selected weight is the strongest visual element. The slider has adjacent minus and plus controls so precise adjustment does not depend on dragging. The assistant conversation sits on a white surface below it, and every answer exposes its source, timestamp and review state.

Weight selection provides context for navigating to a general preparation view. It does not by itself authorize patient-specific advice or medication dosing.

## Preparation view

Content is divided into short, scannable cards with stable headings. General preparation items, reference values and any future calculated information remain visually and structurally separate. Critical cards use the reserved red treatment; routine categories use blue or neutral surfaces.

## Memory bank

Saved assistant answers behave as cards. Users can create named stacks and reorder or move cards. Drag and drop is an enhancement: every action is also available through a visible menu suitable for keyboard and touch use.

A saved answer retains its sources, saved date, content version and review status. Personal organization does not change the answer's clinical review state.

## Interaction principles

- Minimum touch-target size and comfortable spacing are treated as design requirements.
- Focus indicators use a high-contrast interactive style.
- Motion remains subtle and respects reduced-motion preferences.
- Swipe navigation has a visible button or tab alternative.
- Progress, status and severity are communicated with labels as well as color.
