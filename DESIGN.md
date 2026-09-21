---
name: Chevrolet Argentina — Plan Chevrolet
version: 1.0.0
description: >
  Agent-facing design system for reproducing the Chevrolet Argentina Plan Chevrolet
  experience: automotive, premium-accessible, conversion-oriented, spacious, image-led,
  and strongly aligned with Chevrolet's current digital brand language.
colors:
  primary: "#0B5CAD"
  primary-dark: "#063B73"
  primary-light: "#EAF3FB"
  accent: "#F2C94C"
  text: "#1D1D1F"
  text-secondary: "#5F6368"
  text-inverse: "#FFFFFF"
  surface: "#FFFFFF"
  surface-subtle: "#F5F6F7"
  border: "#D9DDE2"
  success: "#188038"
  error: "#B3261E"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontWeight: 700
    fontSize: "clamp(2.5rem, 5vw, 4.75rem)"
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  h1:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontWeight: 700
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  h2:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontWeight: 700
    fontSize: "clamp(1.6rem, 3vw, 2.5rem)"
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontWeight: 700
    fontSize: "1.25rem"
    lineHeight: 1.2
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.55
  body-sm:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontWeight: 400
    fontSize: "0.875rem"
    lineHeight: 1.45
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontWeight: 700
    fontSize: "0.8125rem"
    lineHeight: 1.2
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "96px"
  5xl: "128px"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "999px"
elevation:
  none: "none"
  subtle: "0 1px 3px rgba(0,0,0,0.08)"
  card: "0 4px 18px rgba(0,0,0,0.10)"
  floating: "0 10px 32px rgba(0,0,0,0.14)"
container:
  maxWidth: "1280px"
  pageGutter: "clamp(20px, 4vw, 64px)"
breakpoints:
  mobile: "0px"
  tablet: "768px"
  desktop: "1024px"
  wide: "1440px"
---

# Chevrolet Argentina — Plan Chevrolet

## Overview

Design the Plan Chevrolet experience as a contemporary automotive commerce and financing site: **confident, premium, clear, practical, and conversion-oriented**.

The visual reference is Chevrolet Argentina's current Plan Chevrolet page, not a generic car dealership template. The experience combines large vehicle photography, strong black/white typography, Chevrolet blue for interaction and trust, restrained yellow/gold as a brand accent, generous whitespace, and compact conversion actions.

The primary user journey is:

1. Understand the Plan Chevrolet proposition.
2. See available 0 km models and financing conditions.
3. Compare enough information to choose a model.
4. Start the application with **"Solicitá tu plan"**.
5. Get assistance through WhatsApp or phone if uncertain.
6. Find supporting information such as digital subscription, payments, FAQs, legal information, and customer services.

The source page currently presents a hero proposition around financing a new 0 km, followed by a model catalogue, contact/help content, plan news, digital subscription, and a lead form. It uses repeated model cards with price, financing percentage/term, feature bullets, and conversion CTAs.

### Design personality

- Automotive rather than fintech.
- Premium but accessible rather than luxury-exclusive.
- Confident rather than aggressive.
- Image-led rather than illustration-led.
- Spacious rather than dense.
- Transactional but reassuring.
- Clear enough for users who may know little about savings plans.
- Localized for Argentina: Spanish (Rioplatense), ARS currency, concise CTA language.

### Strong reference

Think: **a Chevrolet showroom translated into a clean digital financing journey**.

Avoid generic SaaS aesthetics. The page should never look like a dashboard, crypto site, banking app, startup landing page, or template marketplace.

---

## Colors

### Primary palette

**Chevrolet Blue — `primary`**

Use as the main interactive and brand-supporting color: links, primary actions, selected states, icons, and small brand accents.

**Deep Blue — `primary-dark`**

Use for hover/pressed states, dark blue information bands, and occasional high-contrast sections. Do not turn the entire interface into a dark theme.

**Brand Accent — `accent`**

Use sparingly for Chevrolet-inspired accent moments, highlights, badges, or small decorative details. It must never compete with vehicle photography or become the dominant CTA color.

### Neutrals

Use white as the dominant surface. Use `surface-subtle` for alternating sections, cards, filters, or information panels.

Text should be nearly black, not pure black, to maintain the clean automotive-editorial feel.

Borders are subtle and should primarily establish grouping rather than decoration.

### Semantic colors

- `success`: confirmations and successful form states.
- `error`: validation errors and destructive/problem states.
- Do not use semantic colors as decorative brand colors.

### Color rules

- Prefer white + near-black + Chevrolet blue.
- Use blue consistently for primary interaction.
- Keep yellow/gold rare.
- Never create rainbow UI.
- Never use gradients as a default visual treatment.
- Do not use neon colors.
- Do not introduce purple, pink, or saturated green as brand colors.
- Photography is allowed to provide most of the visual richness.

---

## Typography

Typography should feel **modern, automotive, editorial, and highly legible**.

Use a clean grotesk/sans-serif system. If the project has access to an approved Chevrolet/GM web font, use it; otherwise use the defined Arial/Helvetica fallback stack rather than introducing a decorative typeface.

### Hierarchy

- Display headings are large, bold, compact, and confident.
- H1/H2 headings should use short phrases.
- Body copy should remain comfortably readable.
- Prices should be visually prominent but not oversized to the point of resembling a finance dashboard.
- Labels and metadata can be smaller and heavier.

### Copy style

Use Argentine Spanish.

Prefer:
- "Solicitá tu plan"
- "Conocé más"
- "Chatear con un asesor"
- "Financiá hasta el 100%"
- "Desde $..."
- "¿Todavía tenés dudas?"

Avoid:
- overly technical financial jargon;
- long marketing paragraphs;
- excessive exclamation marks;
- artificial startup language;
- unexplained acronyms.

---

## Layout

### Page structure

The preferred page rhythm is:

1. Global navigation.
2. Hero / proposition.
3. Model selection.
4. Model cards.
5. Assistance / contact.
6. Educational or informational content.
7. Digital subscription / secondary conversion.
8. Lead form.
9. Full footer with legal and customer-service links.

### Container

Use a centered content container with a maximum width of approximately `1280px`.

Horizontal padding should increase with viewport size:

- Mobile: 20–24px.
- Tablet: 32px.
- Desktop: 48–64px.

Do not stretch text paragraphs across the full viewport.

### Grid

For model cards:

- Desktop: 3-column grid when the viewport allows it.
- Tablet: 2 columns.
- Mobile: 1 column.
- Maintain equal visual card heights where practical.
- Vehicle imagery should dominate the upper portion of each card.

### Hero

The hero should be visually decisive.

Preferred composition:
- large automotive image;
- dark or light high-contrast text depending on image;
- short headline;
- supporting financing statement;
- one primary CTA;
- one secondary contact CTA where appropriate.

Do not place large blocks of text over visually busy areas.

### Spacing

Use generous vertical spacing between major sections.

Major sections should feel like distinct showroom zones, not one continuous wall of content.

---

## Elevation & Depth

Depth should be restrained.

Prefer:
- subtle borders;
- very soft shadows;
- image contrast;
- whitespace;
- section background changes.

Avoid:
- floating-everything;
- excessive card shadows;
- glassmorphism;
- glowing effects;
- 3D UI;
- heavy neumorphism.

Cards may use a subtle shadow when they need separation from a neutral background, but a flat card with a border is equally appropriate.

---

## Shapes

Chevrolet's automotive identity should feel precise rather than playful.

### Radius

- Small controls: 4–8px.
- Cards: 8–12px.
- Pills: only for compact tags/statuses.
- Avoid excessive rounded cards.

Do not use huge 24–32px rounded rectangles for every component.

### Buttons

Buttons should feel substantial and easy to scan.

Primary:
- solid Chevrolet blue;
- white text;
- medium-to-bold weight;
- 8px radius;
- clear hover/pressed states.

Secondary:
- white or transparent;
- blue text;
- blue border;
- same height as primary.

Tertiary:
- text/link treatment;
- no unnecessary container.

Button labels should be action-oriented and short.

---

## Components

### Header / Navigation

The header is a functional navigation system, not a decorative hero element.

Include:
- Chevrolet logo;
- primary navigation;
- Plan Chevrolet section navigation;
- customer-service access;
- mobile menu.

Desktop navigation should remain clean and horizontally scannable.

Mobile navigation should become a full-width, easy-to-tap menu.

Avoid sticky navigation that occupies excessive vertical space.

---

### Hero

Structure:

```text
[Large vehicle image]

[Eyebrow / section label]
Plan Chevrolet

[Large headline]
Financiá hasta el 100%
de tu nuevo 0 km

[Supporting text]

[Primary CTA] Solicitá tu plan
[Secondary CTA] Chatear con un asesor
```

The hero should communicate the product in seconds.

Do not hide the financing proposition behind an interaction.

---

### Vehicle Card

Each model card should support quick comparison.

Recommended anatomy:

```text
[Vehicle image]

[Model name]
[Version]

Desde: $XX.XXX.XXX

Financiá hasta el XX%
en hasta XX cuotas

• Feature
• Feature
• Feature

[Primary CTA] Solicitá tu plan
[Text link] Más sobre [modelo]
```

Rules:

- Price is prominent.
- Financing percentage and term are clearly visible.
- Features are short.
- CTA is always easy to find.
- Images use consistent aspect ratios.
- Do not crop cars in ways that remove important vehicle geometry.
- Avoid putting too much technical specification into the card.

---

### Price

Prices should use Argentine formatting:

`$ 39.745.900`

Do not use USD unless the product explicitly requires it.

If a secondary reference price exists, visually subordinate it.

Never visually imply that a price is fixed if the underlying business rules do not guarantee that.

---

### Financing Highlight

Use a compact visual block for:

- percentage financed;
- maximum number of installments;
- relevant conditions.

Example:

```text
FINANCIACIÓN
Hasta 100%
Hasta 84 cuotas
```

Keep it informational, not like a banking dashboard.

---

### CTA

Primary CTA labels:

- "Solicitá tu plan"
- "Suscribite ahora"
- "Conocé más"
- "Cotizá el tuyo"

The CTA must be visually dominant without becoming oversized.

Avoid:
- "Empezar"
- "Enviar"
- "Click aquí"
- generic "Más info" when a more specific action exists.

---

### Lead Form

The lead form is a high-priority conversion surface.

Principles:

- Ask only for information necessary to begin contact.
- Use explicit field labels.
- Keep labels visible above inputs.
- Use large touch targets.
- Show validation close to the relevant field.
- Never rely exclusively on placeholder text.
- Explain what happens after submission.
- Include privacy/terms context near the submission action.
- Preserve the same visual language as the rest of the site.

Recommended structure:

```text
[Heading]
Completá el formulario y un experto Chevrolet
se pondrá en contacto con vos.

[Nombre]
[Apellido]
[Teléfono]
[Email]
[Modelo de interés]

[ ] Acepto términos / política correspondiente

[Enviar / Solicitar asesoramiento]
```

---

### WhatsApp Contact

WhatsApp is a secondary but highly visible assistance channel.

Use it for:
- questions;
- advisor contact;
- lead recovery.

Do not make WhatsApp visually overpower the primary Plan CTA.

---

### Information Cards

For content such as:
- digital subscription;
- payment methods;
- FAQs;
- latest news;
- plan management.

Use simple cards with:
- icon or image;
- short title;
- 1–3 lines of supporting text;
- clear text CTA.

---

### FAQ / Accordion

Use accordions for dense informational content.

Rules:
- One clear question per row.
- Large enough click/tap target.
- Simple chevron.
- No animated gimmicks.
- Preserve readable line length when expanded.

---

### Footer

The footer can be information-dense but must remain structured.

Recommended groups:

- Modelos
- Plan Chevrolet
- Clientes y Servicios
- Información Legal
- Contacto
- Consumer-protection resources

Keep legal links visibly available but visually secondary.

---

### Form States

Every form control must have:

- default;
- hover;
- focus;
- filled;
- disabled;
- error;
- success where applicable.

Focus states must be clearly visible for keyboard users.

Never remove the browser/accessibility focus indicator without replacing it with an equally visible treatment.

---

## Imagery

Photography is one of the primary design elements.

### Vehicle photography

Prefer:
- high-resolution Chevrolet vehicle photography;
- real environments;
- controlled studio images for product cards;
- clean compositions;
- natural perspective.

Use images to communicate:
- vehicle shape;
- lifestyle;
- technology;
- aspiration;
- practicality.

### Cropping

For cards, use a consistent image frame.

For heroes, allow more expressive cropping.

Never distort vehicle proportions.

Never use generic stock cars that could be mistaken for Chevrolet products.

### Human photography

Use people when demonstrating:
- advisor assistance;
- digital subscription;
- customer service;
- ownership experience.

People should feel authentic and contemporary, not like generic corporate stock photography.

---

## Motion

Motion should be subtle and functional.

Allowed:
- 150–250ms hover transitions;
- button state transitions;
- accordion expansion;
- image opacity/transform on hover;
- gentle entrance animation for major sections.

Avoid:
- parallax-heavy pages;
- dramatic page transitions;
- bouncing buttons;
- continuous animated backgrounds;
- distracting vehicle motion effects.

Respect `prefers-reduced-motion`.

---

## Responsive Behavior

### Mobile

Mobile is a first-class experience.

Priorities:
1. proposition;
2. primary CTA;
3. model cards;
4. advisor contact;
5. form.

Model cards become single-column.

Buttons should generally be full-width when they are primary actions inside narrow cards.

Navigation collapses into a menu.

Avoid horizontal scrolling except where it is an intentional, clearly signposted carousel.

### Tablet

Use two-column content where useful.

Maintain generous spacing but reduce oversized hero typography.

### Desktop

Use the full container width for imagery and grids while keeping text measure constrained.

Use 3-column model cards when content remains readable.

---

## Accessibility

- Target WCAG AA contrast.
- All interactive controls must be keyboard accessible.
- Use semantic headings in logical order.
- Provide alt text for meaningful vehicle and people imagery.
- Decorative images should not create redundant screen-reader content.
- Never encode essential information only through color.
- Form errors must be announced or programmatically associated with fields.
- Touch targets should be at least approximately 44×44px.
- Maintain visible focus states.
- Respect reduced motion.
- Preserve readable zoom behavior up to 200%.

---

## Content & Conversion Rules

The interface is a **decision-support and lead-generation experience**.

Do:
- make financing conditions easy to compare;
- surface relevant terms next to claims;
- distinguish "desde" prices from fixed prices;
- make the next step obvious;
- provide human assistance;
- keep legal/terms information accessible;
- use concise Argentine Spanish.

Don't:
- hide important financing conditions;
- create false urgency;
- use countdown timers unless there is a real, documented deadline;
- fabricate discounts or benefits;
- make unsupported claims about approval, savings, or availability;
- make the user hunt for the application CTA.

---

## Do's and Don'ts

### Do

- Use large, high-quality Chevrolet vehicle imagery.
- Use strong black/white typography with Chevrolet blue interaction.
- Keep the interface spacious.
- Make prices and financing terms scannable.
- Repeat the main conversion action consistently.
- Use clear Spanish appropriate for Argentina.
- Keep cards visually consistent.
- Make mobile forms simple.
- Treat legal and financing information as first-class content.
- Prefer clarity over decorative UI.

### Don't

- Don't turn the page into a generic SaaS landing page.
- Don't use gradients as the main visual identity.
- Don't use glassmorphism.
- Don't use neon colors.
- Don't use excessive rounded corners.
- Don't use giant pill buttons everywhere.
- Don't overload cards with specifications.
- Don't make the yellow accent dominant.
- Don't use generic stock-car imagery.
- Don't create fake badges, reviews, guarantees, financing conditions, or prices.
- Don't imply that current prices or plan conditions are permanent unless the source data says so.
- Don't replace clear financial language with vague marketing copy.
- Don't sacrifice accessibility for visual similarity.

---

## Implementation Guidance for Cursor

When generating or modifying UI:

1. Treat the YAML tokens as the source of truth for reusable values.
2. Treat the prose in this document as the source of truth for visual intent.
3. Reuse existing components before creating new variants.
4. Keep the visual system consistent across all Plan Chevrolet routes.
5. Prefer CSS variables/design tokens over hard-coded one-off values.
6. Build responsive behavior from the mobile layout upward.
7. Keep content/data separate from presentation so model pricing and financing terms can change without redesigning components.
8. Never invent Chevrolet brand assets. Reuse approved project assets when available.
9. If a new component is required, make it feel like an automotive commerce component rather than a generic UI-kit component.
10. When visual fidelity conflicts with generic best practices, prioritize the design intent in this document while preserving accessibility and usability.
11. Do not introduce a new font, color family, radius system, shadow language, or illustration style without a clear reason.
12. For financial claims, use source data supplied by the application rather than hard-coded assumptions.

## Source Reference

This design system is derived from the current Chevrolet Argentina Plan Chevrolet experience and its surrounding Chevrolet Argentina digital language.

Reference:
- https://www.chevrolet.com.ar/plan-chevrolet
- https://www.chevrolet.com.ar/

The reference page currently emphasizes Plan Chevrolet, financing up to 100% on selected models, model-specific cards, advisor contact, digital subscription, FAQs/information, and a lead form. Exact commercial values, available models, prices, and financing conditions are dynamic and must be treated as content/data rather than permanent design tokens.
