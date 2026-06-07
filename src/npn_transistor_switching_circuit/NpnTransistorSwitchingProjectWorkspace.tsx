"use client";

import ProjectWorkspaceTemplate from "../library/templates/ProjectWorkspaceTemplate";
import NpnTransistorSwitchingControlPanel from "./control_panel";
import NpnTransistorSwitchingCircuit from "./NpnTransistorSwitchingCircuit";
import NpnTransistorSwitchingTheory from "./NpnTransistorSwitchingTheory";

// Keeps the top operating strip aligned with the other project workspaces.
function HeaderActions() {
  return (
    <div className="workspace-quickbar">
      <div className="workspace-quickbar-status">
        <span className="workspace-status-pill">Vcc OFF</span>
        <span className="workspace-status-pill">Base LOW</span>
        <span className="workspace-status-pill">LED OFF</span>
      </div>
      <div className="workspace-quickbar-actions">
        <button type="button" className="workspace-quickbar-button is-mcb">
          Vcc OFF
        </button>
        <button type="button" className="workspace-quickbar-button is-start">
          Press SW1
        </button>
        <button type="button" className="workspace-quickbar-button is-stop">
          Release
        </button>
        <button type="button" className="workspace-quickbar-button is-reset">
          Reset
        </button>
        <button type="button" className="workspace-quickbar-button is-fault">
          Test
        </button>
      </div>
    </div>
  );
}

export default function NpnTransistorSwitchingProjectWorkspace() {
  return (
    <ProjectWorkspaceTemplate
      badge="NPN TRANSISTOR SWITCHING"
      title="NPN TRANSISTOR SWITCH CIRCUIT WORKSPACE"
      initialTabKey="theory"
      headerActions={<HeaderActions />}
      tabs={[
        // Theory stays full-width for the reading/explanation area.
        {
          key: "theory",
          label: "Logic & Theory",
          canvasTitle: "NPN Transistor Logic & Theory",
          fullWidth: true,
          canvasContent: <NpnTransistorSwitchingTheory />,
        },
        // Simulation follows the standard control-panel plus canvas layout.
        {
          key: "simulation",
          label: "Simulation CKT",
          canvasTitle: "Simulation CKT Canvas",
          panelTitle: "Control Panel",
          panelContent: <NpnTransistorSwitchingControlPanel />,
          canvasContent: <NpnTransistorSwitchingCircuit />,
          layout: "stacked",
        },
      ]}
    />
  );
}
