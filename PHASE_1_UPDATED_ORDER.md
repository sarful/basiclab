# Phase 1 Updated Order

This file defines the current beginner-friendly order for `Phase 1: Absolute Basics`.

It reflects the present state of the repo after the current-voltage learning track
was expanded into a full 16-lesson sequence with:

- shared lesson header and course navigation
- English theory
- Bangla theory
- Udemy English script
- Udemy Bangla script
- simulation tab for each lesson

Base learning area reviewed:

- [C:\Users\Lab\Desktop\ET Project\react_components_electrical_library\src\Learning_Current_Voltage](</C:/Users/Lab/Desktop/ET%20Project/react_components_electrical_library/src/Learning_Current_Voltage>)

Status legend:

- `Exists` = dedicated lesson folder exists and is now part of the structured lesson flow
- `Complete` = lesson exists and is fully built in the current five-tab format

## Recommended Final Order

| Order | Lesson Title | Folder | Status |
|---|---|---|---|
| 1 | What is electricity? | `01_what_is_electricity` | Complete |
| 2 | What is current? | `02_what_is_current` | Complete |
| 3 | What is voltage? | `03_what_is_voltage` | Complete |
| 4 | What is resistance? | `04_what_is_resistance` | Complete |
| 5 | Ohm's Law basics | `05_ohms_law_basics` | Complete |
| 6 | Power in a circuit | `06_power_in_a_circuit` | Complete |
| 7 | Open circuit vs closed circuit | `07_open_vs_closed_circuit` | Complete |
| 8 | Short circuit basics | `08_short_circuit_basics` | Complete |
| 9 | Series circuit basics | `09_series_circuit_basics` | Complete |
| 10 | Parallel circuit basics | `10_parallel_circuit_basics` | Complete |
| 11 | Series vs parallel comparison | `11_series_vs_parallel_comparison` | Complete |
| 12 | Electron flow | `12_electron_flow` | Complete |
| 13 | AC vs DC basics | `13_ac_vs_dc_basics` | Complete |
| 14 | Types of current | `14_types_of_current` | Complete |
| 15 | Types of voltage | `15_types_of_voltage` | Complete |
| 16 | Voltage vs current comparison | `16_voltage_vs_current_comparison` | Complete |

## Current Repo Order vs Recommended Phase 1 Order

| Current Repo Order | Current Folder | Recommended Position | Notes |
|---|---|---|---|
| 01 | `01_what_is_electricity` | 1 | Good as-is |
| 02 | `02_what_is_current` | 2 | Good as-is |
| 03 | `03_what_is_voltage` | 3 | Good as-is |
| 04 | `04_what_is_resistance` | 4 | Good as-is |
| 05 | `05_ohms_law_basics` | 5 | Good as-is |
| 06 | `06_power_in_a_circuit` | 6 | Good as-is |
| 07 | `07_open_vs_closed_circuit` | 7 | Good as-is |
| 08 | `08_short_circuit_basics` | 8 | Good as-is |
| 09 | `09_series_circuit_basics` | 9 | Good as-is |
| 10 | `10_parallel_circuit_basics` | 10 | Good as-is |
| 11 | `11_series_vs_parallel_comparison` | 11 | Good as-is |
| 12 | `12_electron_flow` | 12 | Good as-is |
| 13 | `13_ac_vs_dc_basics` | 13 | Good as-is |
| 14 | `14_types_of_current` | 14 | Good as-is |
| 15 | `15_types_of_voltage` | 15 | Good as-is |
| 16 | `16_voltage_vs_current_comparison` | 16 | Good as-is |

## What Is Now Built

All 16 Phase 1 lessons now exist as dedicated folders inside
`src/Learning_Current_Voltage` and use the shared lesson shell pattern.

Each lesson is expected to include:

1. `Logic & Theory`
2. `Logic & Theory (Bangla)`
3. `Udemy English Script`
4. `Udemy Script Bangla`
5. `Simulation`

Shared reusable pieces used across the track:

- `shared/lesson_shell`
- `shared/current_voltage_course_nav`
- `shared/quiz_accordion`

## Phase 1 Folder Order

```text
01_what_is_electricity
02_what_is_current
03_what_is_voltage
04_what_is_resistance
05_ohms_law_basics
06_power_in_a_circuit
07_open_vs_closed_circuit
08_short_circuit_basics
09_series_circuit_basics
10_parallel_circuit_basics
11_series_vs_parallel_comparison
12_electron_flow
13_ac_vs_dc_basics
14_types_of_current
15_types_of_voltage
16_voltage_vs_current_comparison
```

## Notes

- Phase 1 is no longer a planning-only structure. It is now present as a real
  built lesson sequence in the repo.
- Several simulations were also polished into a more consistent lesson-style UI,
  especially in the later lessons.
- The next major curriculum gap is no longer inside this Phase 1 set. The next
  likely expansion area is:
  - measurement and multimeter basics
  - breadboard and real hardware basics
  - safety and practical testing flow
