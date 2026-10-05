# Responsive master layout - v1.1.0

The approved desktop (1536x1024) and mobile (941x1672) images are two authoritative views of one UI system. Treat them as visual targets, not separate themes.

At >760px use the wide hierarchy: narrow top navigation, cinematic hero, centered title/actions, four feature cards, compact legal footer. At <=760px use the portrait hierarchy: compact eye/header/hamburger, vertical hero, primary action early, secondary action next, two-column feature cards where they fit, one-column fallback on very narrow screens, stacked footer. Test 320/375/390/430/768/1440 widths and 200% text.

The master images may appear as a noninteractive title poster or QA reference. Never depend on their baked text/buttons for interaction. All controls remain semantic HTML with >=44px targets and visible keyboard focus. Preserve real audio/state handlers and do not invent a separate router.
