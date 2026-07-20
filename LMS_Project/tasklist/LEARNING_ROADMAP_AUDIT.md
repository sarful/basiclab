# Learning Roadmap Audit

This file maps the current repository learning sections against the recommended
beginner electronics roadmap.

Assumptions used for this audit:

- The check is based on folders/modules under
  [C:\Users\Lab\Desktop\ET Project\react_components_electrical_library\LMS_Project\frontend\src\courses\basics-electronics-and-electrical](</C:/Users/Lab/Desktop/ET%20Project/react_components_electrical_library/LMS_Project/frontend/src/courses/basics-electronics-and-electrical>)
- This is a curriculum coverage audit, not a lesson-by-lesson pedagogy scorecard
- Lesson route scaffolds, planning placeholders, shared navigation, and project
  route stubs are counted when they are safely connected to the LMS structure

Status legend:

- `Complete` = present, routed, and structured inside the active LMS lesson shell
- `Scaffolded` = dedicated route/folder/file structure exists and is connected,
  but still needs final teaching content or final simulation implementation
- `Partial` = partly covered, or covered indirectly, but not yet as a clean
  dedicated lesson
- `Missing` = no dedicated lesson found yet

Shared structure status:

- `UniversalLessonHeader` remains the shared lesson header source for lesson pages
- `UniversalLessonCourseNav` is now the single reusable lesson navigation pattern
  for the course lesson tracks already wired to the shared registry
- The active shared lesson registry source is
  `LMS_Project/frontend/src/courses/basics-electronics-and-electrical/shared/lessonRegistry.ts`
- The simulation shell now uses the shared course navigation path so lesson pages
  can reuse one navigation system
- Root lesson track routes now have redirect entry pages so
  `/current-voltage-learning`, `/measurement-practical-basics`,
  `/capacitor-learning`, `/diode-learning`, `/transformer-learning`,
  `/fuse-learning`, `/optocoupler-learning`, `/pushbutton-learning`,
  `/relay-learning`, `/transistor-learning`, and
  `/voltage-regulator-learning` no longer fall into route-not-found at the
  top-level entry path

## Current Folder Coverage

| Track | Current Repo Status | Notes |
|---|---|---|
| Current & Voltage | Very Strong | Full 16-lesson foundation sequence is present |
| Measurement & Practical Basics | Strong | Full 10-lesson practical intro sequence is present |
| Resistor | Very Strong | Core lessons complete and Lesson 3.14 planning route scaffold added |
| Capacitor | Strong | Core lessons complete and Lesson 4.9 to 4.13 scaffolds added |
| Diode | Strong | Core lessons complete and Lesson 5.14 to 5.16 scaffolds added |
| Transistor | Mid | Core intro lessons complete and Lesson 6.5 to 6.17 scaffolds added |
| Transformer | Mid | Intro complete and Lesson 7.2 to 7.9 scaffolds added |
| Voltage Regulator | Mid | Intro complete and Lesson 8.2 to 8.10 scaffolds added |
| Fuse | Early-Mid | Intro exists and scaffold expansion added |
| Relay | Early | Two routed lessons exist |
| Optocoupler | Early-Mid | Intro exists and isolation-use scaffold added |
| Pushbutton | Early-Mid | Practical lesson exists and basics scaffold added |
| Mini Projects | Growing | Multiple project workspaces now scaffolded and linked |

## Lesson 1: Absolute Basics

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 1.1 What is electricity? | Complete | `app/current-voltage-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/01_what_is_electricity` |
| 1.2 What is current? | Complete | `app/current-voltage-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/02_what_is_current` |
| 1.3 What is voltage? | Complete | `app/current-voltage-learning/3` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/03_what_is_voltage` |
| 1.4 What is resistance? | Complete | `app/current-voltage-learning/4` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/04_what_is_resistance` |
| 1.5 Ohm's law | Complete | `app/current-voltage-learning/5` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/05_ohms_law_basics` |
| 1.6 Power in a circuit | Complete | `app/current-voltage-learning/6` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/06_power_in_a_circuit` |
| 1.7 Open circuit vs closed circuit | Complete | `app/current-voltage-learning/7` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/07_open_vs_closed_circuit` |
| 1.8 Short circuit basics | Complete | `app/current-voltage-learning/8` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/08_short_circuit_basics` |
| 1.9 Series circuit basics | Complete | `app/current-voltage-learning/9` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/09_series_circuit_basics` |
| 1.10 Parallel circuit basics | Complete | `app/current-voltage-learning/10` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/10_parallel_circuit_basics` |
| 1.11 Series vs parallel comparison | Complete | `app/current-voltage-learning/11` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/11_series_vs_parallel_comparison` |
| 1.12 Electron flow vs conventional flow | Complete | `app/current-voltage-learning/12` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/12_electron_flow` |
| 1.13 AC vs DC basics | Complete | `app/current-voltage-learning/13` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/13_ac_vs_dc_basics` |
| 1.14 Types of current | Complete | `app/current-voltage-learning/14` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/14_types_of_current` |
| 1.15 Types of voltage | Complete | `app/current-voltage-learning/15` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/15_types_of_voltage` |
| 1.16 Voltage vs current comparison | Complete | `app/current-voltage-learning/16` and `src/courses/basics-electronics-and-electrical/Learning_Current_Voltage/16_voltage_vs_current_comparison` |

## Lesson 2: Measurement & Practical Basics

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 2.1 What is a multimeter? | Complete | `app/measurement-practical-basics/1` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/01_what_is_a_multimeter` |
| 2.2 Measuring voltage | Complete | `app/measurement-practical-basics/2` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/02_measuring_voltage` |
| 2.3 Measuring current | Complete | `app/measurement-practical-basics/3` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/03_measuring_current` |
| 2.4 Measuring resistance | Complete | `app/measurement-practical-basics/4` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/04_measuring_resistance` |
| 2.5 Continuity test | Complete | `app/measurement-practical-basics/5` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/05_continuity_test` |
| 2.6 Polarity and ground | Complete | `app/measurement-practical-basics/6` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/06_polarity_and_ground` |
| 2.7 Battery basics | Complete | `app/measurement-practical-basics/7` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/07_battery_basics` |
| 2.8 Breadboard basics | Complete | `app/measurement-practical-basics/8` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/08_breadboard_basics` |
| 2.9 Wire, jumper, and terminal basics | Complete | `app/measurement-practical-basics/9` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/09_wire_jumper_terminal_basics` |
| 2.10 Basic circuit safety | Complete | `app/measurement-practical-basics/10` and `src/courses/basics-electronics-and-electrical/Learning_Measurement_Practical_Basics/10_basic_circuit_safety` |

## Lesson 3: Resistor Track

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 3.1 What is a resistor? | Complete | `app/resistor-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_resistor/02_what_is_resistor` |
| 3.2 Resistor structure | Complete | `app/resistor-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_resistor/03_resistor_structure_simulation` |
| 3.3 Types of resistors | Complete | `app/resistor-learning/3` and `src/courses/basics-electronics-and-electrical/Learning_resistor/04_resistor_types` |
| 3.4 Fixed resistor | Complete | `app/resistor-learning/4` and `src/courses/basics-electronics-and-electrical/Learning_resistor/05_fixed_resistor` |
| 3.5 Variable resistor / potentiometer | Complete | `app/resistor-learning/5` and `src/courses/basics-electronics-and-electrical/Learning_resistor/06_potentiometer` |
| 3.6 Thermistor | Complete | `app/resistor-learning/6` and `src/courses/basics-electronics-and-electrical/Learning_resistor/07_thermistor_interactive_simulation` |
| 3.7 LDR | Complete | `app/resistor-learning/7` and `src/courses/basics-electronics-and-electrical/Learning_resistor/08_ldr_interactive_simulation` |
| 3.8 Resistor color code | Complete | `app/resistor-learning/8` and `src/courses/basics-electronics-and-electrical/Learning_resistor/09_resistor_color_code_interactive_simulation` |
| 3.9 Resistor power rating | Complete | `app/resistor-learning/9` and `src/courses/basics-electronics-and-electrical/Learning_resistor/10_resistor_power_rating_interactive_simulation` |
| 3.10 Ohm's law with resistor | Complete | `app/resistor-learning/10` and `src/courses/basics-electronics-and-electrical/Learning_resistor/11_ohms_law_interactive_simulation` |
| 3.11 Series resistor circuit | Complete | `app/resistor-learning/11` and `src/courses/basics-electronics-and-electrical/Learning_resistor/12_series_resistor_circuit_interactive_simulation` |
| 3.12 Parallel resistor circuit | Complete | `app/resistor-learning/12` and `src/courses/basics-electronics-and-electrical/Learning_resistor/13_parallel_resistor_circuit_interactive_simulation` |
| 3.13 Voltage drop | Complete | `app/resistor-learning/13` and `src/courses/basics-electronics-and-electrical/Learning_resistor/14_voltage_drop_interactive_simulation` |
| 3.14 Current limiting resistor for LED | Scaffolded | `app/resistor-learning/15` and `src/courses/basics-electronics-and-electrical/Learning_resistor/15_current_limiting_resistor_for_led`; dedicated placeholder route exists and is connected into resistor lesson navigation |

## Lesson 4: Capacitor Track

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 4.1 What is a capacitor? | Complete | `app/capacitor-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/01_capacitor_interactive_simulation` |
| 4.2 What is capacitance? | Complete | `app/capacitor-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/02_capacitance_interactive_simulation` |
| 4.3 Capacitor structure | Complete | `app/capacitor-learning/3` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/03_capacitor_structure_interactive_simulation` |
| 4.4 Working principle of capacitor | Complete | `app/capacitor-learning/4` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/04_capacitor_working_principle_interactive_simulation` |
| 4.5 Ceramic capacitor | Complete | `app/capacitor-learning/5` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/05_ceramic_capacitor_interactive_simulation` |
| 4.6 Electrolytic capacitor | Complete | `app/capacitor-learning/6` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/06_electrolytic_capacitor_interactive_simulation` |
| 4.7 Polarized vs non-polarized capacitor | Complete | `app/capacitor-learning/7` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/07_polarized_vs_nonpolarized_capacitor_interactive_simulation` |
| 4.8 Variable capacitor | Complete | `app/capacitor-learning/8` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/08_variable_capacitor_interactive_simulation` |
| 4.9 Capacitor charging | Scaffolded | `app/capacitor-learning/9` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/09_capacitor_charging`; dedicated placeholder lesson is now present |
| 4.10 Capacitor discharging | Scaffolded | `app/capacitor-learning/10` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/10_capacitor_discharging`; dedicated placeholder lesson is now present |
| 4.11 RC time constant | Scaffolded | `app/capacitor-learning/11` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/11_rc_time_constant`; dedicated placeholder lesson is now present |
| 4.12 Capacitor in filter circuit | Scaffolded | `app/capacitor-learning/12` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/12_capacitor_in_filter_circuit`; now split into its own route scaffold instead of only indirect diode-track coverage |
| 4.13 Capacitor in timing circuit | Scaffolded | `app/capacitor-learning/13` and `src/courses/basics-electronics-and-electrical/Learning_capacitor/13_capacitor_in_timing_circuit`; dedicated placeholder lesson is now present |

## Lesson 5: Diode Track

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 5.1 What is a diode? | Complete | `app/diode-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_diode/01_what_is_diode` |
| 5.2 Diode construction | Complete | `app/diode-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_diode/02_diode_construction` |
| 5.3 Diode working principle | Complete | `app/diode-learning/3` and `src/courses/basics-electronics-and-electrical/Learning_diode/03_working_principle` |
| 5.4 Diode characteristics | Complete | `app/diode-learning/4` and `src/courses/basics-electronics-and-electrical/Learning_diode/04_diode_characteristics` |
| 5.5 Types of diodes | Complete | `app/diode-learning/5` and `src/courses/basics-electronics-and-electrical/Learning_diode/05_diode_types` |
| 5.6 Diode testing | Complete | `app/diode-learning/6` and `src/courses/basics-electronics-and-electrical/Learning_diode/06_diode_testing` |
| 5.7 Half-wave rectifier | Complete | `app/diode-learning/7` and `src/courses/basics-electronics-and-electrical/Learning_diode/07_half_wave_rectifier` |
| 5.8 Center-tap full-wave rectifier | Complete | `app/diode-learning/8` and `src/courses/basics-electronics-and-electrical/Learning_diode/08_center_tap_full_wave_rectifier` |
| 5.9 Bridge rectifier | Complete | `app/diode-learning/9` and `src/courses/basics-electronics-and-electrical/Learning_diode/09_bridge_rectifier` |
| 5.10 Filter circuit | Complete | `app/diode-learning/10` and `src/courses/basics-electronics-and-electrical/Learning_diode/10_filter_circuit` |
| 5.11 Zener diode | Complete | `app/diode-learning/13` and `src/courses/basics-electronics-and-electrical/Learning_diode/13_zener_diode` |
| 5.12 LED | Complete | `app/diode-learning/11` and `src/courses/basics-electronics-and-electrical/Learning_diode/11_led` |
| 5.13 Photodiode | Complete | `app/diode-learning/12` and `src/courses/basics-electronics-and-electrical/Learning_diode/12_photodiode` |
| 5.14 Clipper circuit | Scaffolded | `app/diode-learning/14` and `src/courses/basics-electronics-and-electrical/Learning_diode/14_clipper_circuit`; dedicated placeholder lesson is now present |
| 5.15 Clamper circuit | Scaffolded | `app/diode-learning/15` and `src/courses/basics-electronics-and-electrical/Learning_diode/15_clamper_circuit`; dedicated placeholder lesson is now present |
| 5.16 Flyback diode / protection diode | Scaffolded | `app/diode-learning/16` and `src/courses/basics-electronics-and-electrical/Learning_diode/16_flyback_diode_protection_diode`; dedicated placeholder lesson is now present |

## Lesson 6: Transistor Track

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 6.1 What is a transistor? | Complete | `app/transistor-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_transistor/01_transistor_interactive_simulation_bangla` |
| 6.2 Transistor structure | Complete | `app/transistor-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_transistor/02_transistor_structure_interactive` |
| 6.3 Emitter, base, collector | Complete | `app/transistor-learning/3` and `src/courses/basics-electronics-and-electrical/Learning_transistor/03_transistor_terminals_emitter_base_collector` |
| 6.4 Transistor types | Complete | `app/transistor-learning/4` and `src/courses/basics-electronics-and-electrical/Learning_transistor/04_transistor_types_interactive_simulation` |
| 6.5 NPN transistor working | Scaffolded | `app/transistor-learning/5` and `src/courses/basics-electronics-and-electrical/Learning_transistor/05_npn_transistor_working`; dedicated placeholder lesson is now present |
| 6.6 PNP transistor working | Scaffolded | `app/transistor-learning/6` and `src/courses/basics-electronics-and-electrical/Learning_transistor/06_pnp_transistor_working`; dedicated placeholder lesson is now present |
| 6.7 Transistor as a switch | Scaffolded | `app/transistor-learning/7` and `src/courses/basics-electronics-and-electrical/Learning_transistor/07_transistor_as_a_switch`; dedicated placeholder lesson is now present |
| 6.8 Transistor biasing basics | Scaffolded | `app/transistor-learning/8` and `src/courses/basics-electronics-and-electrical/Learning_transistor/08_transistor_biasing_basics`; dedicated placeholder lesson is now present |
| 6.9 Common emitter basics | Scaffolded | `app/transistor-learning/9` and `src/courses/basics-electronics-and-electrical/Learning_transistor/09_common_emitter_basics`; dedicated placeholder lesson is now present |
| 6.10 Common collector basics | Scaffolded | `app/transistor-learning/10` and `src/courses/basics-electronics-and-electrical/Learning_transistor/10_common_collector_basics`; dedicated placeholder lesson is now present |
| 6.11 Common base basics | Scaffolded | `app/transistor-learning/11` and `src/courses/basics-electronics-and-electrical/Learning_transistor/11_common_base_basics`; dedicated placeholder lesson is now present |
| 6.12 Transistor as amplifier | Scaffolded | `app/transistor-learning/12` and `src/courses/basics-electronics-and-electrical/Learning_transistor/12_transistor_as_amplifier`; dedicated placeholder lesson is now present |
| 6.13 BJT vs MOSFET | Scaffolded | `app/transistor-learning/13` and `src/courses/basics-electronics-and-electrical/Learning_transistor/13_bjt_vs_mosfet`; dedicated placeholder lesson is now present |
| 6.14 MOSFET basics | Scaffolded | `app/transistor-learning/14` and `src/courses/basics-electronics-and-electrical/Learning_transistor/14_mosfet_basics`; dedicated placeholder lesson is now present |
| 6.15 JFET basics | Scaffolded | `app/transistor-learning/15` and `src/courses/basics-electronics-and-electrical/Learning_transistor/15_jfet_basics`; dedicated placeholder lesson is now present |
| 6.16 Transistor driving relay | Scaffolded | `app/transistor-learning/16` and `src/courses/basics-electronics-and-electrical/Learning_transistor/16_transistor_driving_relay`; dedicated placeholder lesson is now present |
| 6.17 Transistor in LED switching circuit | Scaffolded | `app/transistor-learning/17` and `src/courses/basics-electronics-and-electrical/Learning_transistor/17_transistor_in_led_switching_circuit`; dedicated placeholder lesson is now present |

## Lesson 7: Transformer Track

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 7.1 What is a transformer? | Complete | `app/transformer-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_transformer/01_transformer_interactive_simulation` |
| 7.2 Transformer working principle | Scaffolded | `app/transformer-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_transformer/02_transformer_working_principle`; dedicated placeholder lesson is now present |
| 7.3 Primary and secondary winding | Scaffolded | `app/transformer-learning/3` and `src/courses/basics-electronics-and-electrical/Learning_transformer/03_primary_and_secondary_winding`; dedicated placeholder lesson is now present |
| 7.4 Step-up transformer | Scaffolded | `app/transformer-learning/4` and `src/courses/basics-electronics-and-electrical/Learning_transformer/04_step_up_transformer`; dedicated placeholder lesson is now present |
| 7.5 Step-down transformer | Scaffolded | `app/transformer-learning/5` and `src/courses/basics-electronics-and-electrical/Learning_transformer/05_step_down_transformer`; dedicated placeholder lesson is now present |
| 7.6 Turns ratio | Scaffolded | `app/transformer-learning/6` and `src/courses/basics-electronics-and-electrical/Learning_transformer/06_turns_ratio`; dedicated placeholder lesson is now present |
| 7.7 Center-tap transformer | Scaffolded | `app/transformer-learning/7` and `src/courses/basics-electronics-and-electrical/Learning_transformer/07_center_tap_transformer`; dedicated placeholder lesson is now present |
| 7.8 Transformer with rectifier | Scaffolded | `app/transformer-learning/8` and `src/courses/basics-electronics-and-electrical/Learning_transformer/08_transformer_with_rectifier`; dedicated placeholder lesson is now present |
| 7.9 Transformer ratings and safety | Scaffolded | `app/transformer-learning/9` and `src/courses/basics-electronics-and-electrical/Learning_transformer/09_transformer_ratings_and_safety`; dedicated placeholder lesson is now present |

## Lesson 8: Voltage Regulator Track

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 8.1 What is a voltage regulator? | Complete | `app/voltage-regulator-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/01_voltage_regulator_interactive_simulation` |
| 8.2 Why regulation is needed | Scaffolded | `app/voltage-regulator-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/02_why_regulation_is_needed`; dedicated placeholder lesson is now present |
| 8.3 78xx series | Scaffolded | `app/voltage-regulator-learning/3` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/03_78xx_series`; dedicated placeholder lesson is now present |
| 8.4 79xx series | Scaffolded | `app/voltage-regulator-learning/4` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/04_79xx_series`; dedicated placeholder lesson is now present |
| 8.5 LM317 adjustable regulator | Scaffolded | `app/voltage-regulator-learning/5` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/05_lm317_adjustable_regulator`; dedicated placeholder lesson is now present |
| 8.6 Output voltage calculation | Scaffolded | `app/voltage-regulator-learning/6` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/06_output_voltage_calculation`; dedicated placeholder lesson is now present |
| 8.7 Dropout voltage | Scaffolded | `app/voltage-regulator-learning/7` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/07_dropout_voltage`; dedicated placeholder lesson is now present |
| 8.8 Heat dissipation | Scaffolded | `app/voltage-regulator-learning/8` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/08_heat_dissipation`; dedicated placeholder lesson is now present |
| 8.9 Regulator with rectifier and filter | Scaffolded | `app/voltage-regulator-learning/9` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/09_regulator_with_rectifier_and_filter`; dedicated placeholder lesson is now present |
| 8.10 Linear vs switching regulator | Scaffolded | `app/voltage-regulator-learning/10` and `src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/10_linear_vs_switching_regulator`; dedicated placeholder lesson is now present |

## Lesson 9: Protection & Control Components

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 9.1 Fuse basics | Partial | `app/fuse-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_Fuse/01_fuse_overvoltage_protection_simulation`; routed lesson exists, but current implementation remains overvoltage-focused rather than a clean fundamentals lesson |
| 9.2 Fuse in overcurrent protection | Scaffolded | `app/fuse-learning/3` and `src/courses/basics-electronics-and-electrical/Learning_Fuse/03_fuse_in_overcurrent_protection`; dedicated placeholder lesson is now present |
| 9.3 Pushbutton basics | Scaffolded | `app/pushbutton-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_Pushbutton/02_pushbutton_basics`; dedicated placeholder lesson is now present |
| 9.4 Pushbutton in LED control | Complete | `app/pushbutton-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_Pushbutton/01_led_pushbutton_switch_circuit_simulation` |
| 9.5 Relay basics | Complete | `app/relay-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_Relay/01_what_is_relay_educational` |
| 9.6 Relay AC lamp control | Complete | `app/relay-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_Relay/02_relay_ac_lamp_control_simulation` |
| 9.7 Optocoupler basics | Complete | `app/optocoupler-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_optocoupler/01_optocoupler_interactive_simulation` |
| 9.8 Optocoupler isolation use case | Scaffolded | `app/optocoupler-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_optocoupler/02_optocoupler_isolation_use_case`; dedicated placeholder lesson is now present |

## Lesson 10: Mini Projects

| Lesson | Status | Existing Mapping / Notes |
|---|---|---|
| 10.1 LED with resistor | Scaffolded | `app/led-with-resistor-project` and `src/courses/basics-electronics-and-electrical/Project/led_with_resistor_project`; dedicated project workspace now exists |
| 10.2 Pushbutton LED control | Complete | `app/pushbutton-learning/1` and `src/courses/basics-electronics-and-electrical/Learning_Pushbutton/01_led_pushbutton_switch_circuit_simulation` |
| 10.3 Relay lamp control | Complete | `app/relay-learning/2` and `src/courses/basics-electronics-and-electrical/Learning_Relay/02_relay_ac_lamp_control_simulation` |
| 10.4 Bridge rectifier power supply | Scaffolded | `app/bridge-rectifier-power-supply-project` and `src/courses/basics-electronics-and-electrical/Project/bridge_rectifier_power_supply_project`; dedicated project workspace now exists |
| 10.5 Regulated DC supply | Scaffolded | `app/regulated-dc-supply-project` and `src/courses/basics-electronics-and-electrical/Project/regulated_dc_supply_project`; dedicated project workspace now exists |
| 10.6 LDR automatic light | Scaffolded | `app/ldr-automatic-light-project` and `src/courses/basics-electronics-and-electrical/Project/ldr_automatic_light_project`; dedicated project workspace now exists |
| 10.7 Thermistor temperature alarm | Scaffolded | `app/thermistor-temperature-alarm-project` and `src/courses/basics-electronics-and-electrical/Project/thermistor_temperature_alarm_project`; dedicated project workspace now exists |
| 10.8 Transistor switch circuit | Scaffolded | `app/transistor-switch-circuit-project` and `src/courses/basics-electronics-and-electrical/Project/transistor_switch_circuit_project`; dedicated project workspace now exists |
| 10.9 MOSFET load switch | Scaffolded | `app/mosfet-load-switch-project` and `src/courses/basics-electronics-and-electrical/Project/mosfet_load_switch_project`; dedicated project workspace now exists |
| 10.10 Simple sensor interface | Scaffolded | `app/simple-sensor-interface-project` and `src/courses/basics-electronics-and-electrical/Project/simple_sensor_interface_project`; dedicated project workspace now exists |

## Biggest Gaps To Prioritize Next

1. `Scaffolded lesson content completion`
   - Fill final logic theory teaching content
   - Add final Bangla teaching content where required
   - Replace placeholder simulation definitions with final interactive implementations

2. `Transistor and regulator depth`
   - These now have route scaffolds, but still need final learner-ready content
   - Progressively normalize them into the same quality level as Lesson 1 and Lesson 2

3. `Protection track cleanup`
   - Refine `Fuse basics` so it reads like a fundamentals lesson instead of mainly an overvoltage example
   - Finalize pushbutton and optocoupler scaffold content

4. `Mini project completion`
   - Convert new project workspaces from planning placeholders into full end-to-end guided builds

5. `Shared navigation rollout`
   - Continue moving remaining lesson families onto the single shared lesson navigation pattern where still needed

## Suggested Build Order

1. Finish scaffolded Lesson 3 to Lesson 5 teaching content
2. Finish scaffolded Lesson 6 transistor content
3. Finish scaffolded Lesson 7 and Lesson 8 power-system content
4. Normalize Lesson 9 protection/control content
5. Complete Lesson 10 mini-project teaching and simulation implementations
