# Measuring Voltage Simulation Developer Checklist

## Goal

Build a Lesson 2 interactive simulation for measuring voltage by reusing the
existing digital multimeter trainer library and adding voltage-specific
learning flow, scenarios, and validation.

## Reuse First

- Reuse `DigitalMultimeterSimulator` when a generic trainer is enough.
- Reuse `DigitalMultimeterCanvas` if Lesson 2 needs a custom training layout.
- Reuse `useMultimeterDial` for dial state, jack state, and validation flow.
- Reuse `multimeterModes.ts` for voltage family rules, then extend only where
  Lesson 2 needs scenario-specific logic.

## Current Lesson 2 Files

- `MeasuringVoltageInteractiveSimulation.tsx`
- `MeasurementPracticalLessonTwoSimulation.tsx`
- `page.tsx`

## Phase 1: Scenario Foundation

- Create a voltage scenario data file.
- Define beginner-safe scenarios:
  - `9V battery DC`
  - `12V DC supply`
  - `220V AC source demo`
  - `wrong red jack`
  - `wrong dial family`
- Each scenario should include:
  - `id`
  - `title`
  - `sourceType`
  - `expectedDialFamily`
  - `expectedRedLeadJack`
  - `expectedBlackLeadJack`
  - `expectedDisplayValue`
  - `teachingGoal`
  - `safetyHint`

## Phase 2: Guided Learning Flow

- Add a guided mission block for Lesson 2.
- Show one active mission at a time.
- Add step-by-step learner prompts:
  - choose ACV or DCV
  - keep black lead in COM
  - keep red lead in VΩmA
  - measure across two points
  - read the LCD value
- Add clear success state and correction state.

## Phase 3: Voltage-Specific Validation

- Add voltage lesson rules on top of generic multimeter validation.
- Show red feedback when:
  - user selects current mode
  - user selects resistance mode
  - red lead is in `10A`
  - AC source uses `DCV`
  - DC source uses `ACV`
- Show green feedback when:
  - dial family is correct
  - lead placement is correct
  - reading is appropriate for the selected source

## Phase 4: Virtual Probe Placement

- Add simple voltage source terminals for the learner to probe.
- Recommended terminals:
  - battery `+` and `-`
  - DC supply `V+` and `GND`
  - AC supply `L` and `N`
- Add interaction state for:
  - red probe target
  - black probe target
- Display should respond to probe placement, not only dial selection.

## Phase 5: LCD Output Logic

- Show realistic voltage values based on the selected scenario.
- Support:
  - positive DC reading
  - negative DC reading for reversed probes
  - AC reading
  - `0.00` or near-zero when both probes are on the same node
  - `Err` for clearly invalid training states if needed
- Keep output aligned with the existing LCD formatting rules.

## Phase 6: Training UI Polish

- Add Lesson 2 specific side panel content:
  - mission title
  - voltage source type
  - correct dial family
  - lead placement reminder
  - expected reading hint
- Keep the multimeter as the primary visual focus.
- Avoid mixing too much generic Lesson 1 copy into Lesson 2.

## Phase 7: Scenario Progression

- Add `Next Scenario` and `Reset Scenario` flow.
- Let users repeat mistakes safely.
- Track:
  - current scenario
  - completed scenarios
  - whether the learner solved the current task correctly

## Phase 8: Acceptance Criteria

- Learner can switch between DCV and ACV practice.
- Learner gets blocked/warned when using the `10A` jack for voltage.
- LCD value changes based on scenario and probe placement.
- Setup feedback is green only when the full voltage setup is correct.
- Setup feedback is red with a clear guide when the setup is wrong.
- Lesson 2 simulation remains reusable and does not hardcode page-only logic
  into the shared multimeter canvas layer.

## Suggested New Files

- `measuringVoltageScenarios.ts`
- `useMeasuringVoltageScenario.ts`
- `VoltageSourcePracticePanel.tsx`
- `VoltageProbeBoard.tsx`

## Suggested Build Order

1. `measuringVoltageScenarios.ts`
2. `useMeasuringVoltageScenario.ts`
3. `VoltageSourcePracticePanel.tsx`
4. integrate scenario state into `MeasuringVoltageInteractiveSimulation.tsx`
5. connect LCD output to scenario + probe state
6. polish feedback and progression

## Done Definition

Lesson 2 is complete when the user can:

- pick the correct voltage mode
- place the leads in the correct jacks
- probe across the correct two points
- see a believable voltage reading
- understand why a setup is right or wrong
