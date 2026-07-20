# Project Architecture

## Goal

This project is evolving from a web-only electrical training library into a shared platform with:

- a Next.js web app
- a future React Native mobile app
- shared star-delta and DOL simulation logic
- reusable symbol/data/model packages

The main idea is:

- keep UI separate for web and mobile
- share simulation logic, types, labels, and constants
- avoid copying business logic across apps

## Recommended Architecture

```text
electrical_training_platform/
  app/                              # Current Next.js app router pages
    dol-project/
    library/
    ster_delta_with_timer/

  public/                           # Static assets for web

  src/
    library/                        # Current web component library
      buttons/
      contactors/
      dol-project/
      indicators/
      motors/
      protection/
      star_delta_control_diagram/
      templates/

  apps/
    mobile/                         # Future Expo / React Native app
      app/                          # expo-router screens
      src/
        components/
        features/
        hooks/
        screens/
        theme/
      assets/
      package.json                  # Add when mobile app is scaffolded

  packages/
    core/                           # Shared simulation engine
      src/
        constants/
        dol/
        star-delta/
        machine/
        math/
        index.ts

    types/                          # Shared TS types/interfaces
      src/
        index.ts

    assets/                         # Shared static descriptions / metadata
      symbols/
      labels/
      docs/

  docs/
    PROJECT_ARCHITECTURE.md
```

## What Stays Where

### 1. Web-only code

Keep these in the current web app:

- Next.js routes in `app/`
- current SVG-heavy training pages
- web-only layout CSS
- current interactive web workspace shells

Examples:

- `app/ster_delta_with_timer/page.tsx`
- `src/library/star_delta_control_diagram/StarDeltaWithTimerWorkspace.tsx`
- `src/library/templates/ProjectWorkspaceTemplate.tsx`

### 2. Shared core logic

Move these gradually into `packages/core`:

- star-delta motor state transitions
- DOL starter state transitions
- overload calculation
- timer progression
- current draw calculation
- motor speed calculation
- reusable simulation helpers

### 3. Shared types

Move these into `packages/types`:

- simulation mode types
- motor specification types
- overload/fault state types
- panel summary types
- diagram label contracts

### 4. Mobile-only code

Future React Native code should live in `apps/mobile`:

- native screens
- mobile navigation
- touch controls
- bottom sheets
- zoom/pan diagram viewer wrappers
- mobile styling/theme tokens

## Project-specific Feature Breakdown

### DOL project

Keep feature structure like this:

```text
src/library/dol-project/
  control_panel.tsx
  dolControlCircuit.tsx
  DOLStarterPowerDiagram.tsx
  DOLStarterProjectWorkspace.tsx
```

Later shared logic should move to:

```text
packages/core/src/dol/
  machine.ts
  calculations.ts
  labels.ts
  status.ts
```

### Star-delta project

Current web feature:

```text
src/library/star_delta_control_diagram/
  controlpanalforsterdeltawithtimer.tsx
  StarDeltaWithTimerWorkspace.tsx
  star_delta_control_diagram_withtimer.tsx
  star_delta_power_diagram_withtimer.tsx
```

Future shared logic target:

```text
packages/core/src/star-delta/
  machine.ts
  calculations.ts
  transitions.ts
  overload.ts
  timer.ts
  labels.ts
```

## Professional Migration Plan

### Phase 1. Stabilize current web app

- keep current routes working
- keep current symbols in `src/library`
- keep current layout/template system working

### Phase 2. Extract pure logic

Create reusable modules in `packages/core` for:

- current draw
- RPM/speed logic
- timer logic
- trip logic
- state machine transitions

Important rule:

- no React in `packages/core`
- only TypeScript functions, constants, and models

### Phase 3. Extract shared types

Create reusable types in `packages/types` such as:

- `SimulationMode`
- `MotorSpec`
- `MotorTelemetry`
- `TripReason`
- `StarterFamily`

### Phase 4. Scaffold mobile app

When ready, generate:

- Expo + TypeScript
- `expo-router`
- `react-native-svg`
- `zustand`

Then connect the app to `packages/core`.

### Phase 5. Build mobile UI around shared logic

Recommended mobile screens:

- `Home`
- `DOL Starter`
- `Star Delta Starter`
- `Power Circuit`
- `Control Circuit`
- `Combined Simulation`
- `Settings`

## Mobile UI Strategy

Do not copy the web layout directly into mobile.

Use:

- top status pills
- action buttons
- bottom-sheet settings
- swipe tabs
- zoomable diagram stage
- compact telemetry cards

## Folder Naming Recommendations

Use these naming rules consistently:

- `kebab-case` for route folders
- `PascalCase` for React component files
- `camelCase` for helpers/hooks
- keep diagram families grouped by feature

Good examples:

- `apps/mobile/src/screens/StarDeltaScreen.tsx`
- `packages/core/src/star-delta/machine.ts`
- `packages/core/src/star-delta/calculations.ts`

## Immediate Next Step

The most professional next implementation step is:

1. create `packages/core`
2. move star-delta current/timer/trip logic out of `StarDeltaWithTimerWorkspace.tsx`
3. create shared types in `packages/types`
4. keep web UI unchanged until shared core is stable
5. scaffold `apps/mobile` only after shared core is ready

This keeps the current website stable while preparing cleanly for React Native.
