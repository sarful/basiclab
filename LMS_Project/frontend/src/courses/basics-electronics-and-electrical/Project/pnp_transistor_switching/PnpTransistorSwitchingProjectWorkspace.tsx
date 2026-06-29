"use client";

import ProjectWorkspaceTemplate from "../library/templates/ProjectWorkspaceTemplate";
import PnpTransistorSwitchingControlPanel from "./control_panel";
import PnpTransistorSwitchingCircuit from "./PnpTransistorSwitchingCircuit";
import PnpTransistorSwitchingTheory from "./PnpTransistorSwitchingTheory";

function HeaderActions() {
  return (
    <div className="workspace-quickbar">
      <div className="workspace-quickbar-status">
        <span className="workspace-status-pill">Vcc OFF</span>
        <span className="workspace-status-pill">Base HIGH</span>
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

export default function PnpTransistorSwitchingProjectWorkspace() {
  return (
    <ProjectWorkspaceTemplate
      badge="PNP TRANSISTOR SWITCHING"
      title="PNP TRANSISTOR SWITCH CIRCUIT WORKSPACE"
      initialTabKey="theory"
      headerActions={<HeaderActions />}
      tabs={[
        {
          key: "theory",
          label: "Logic & Theory",
          canvasTitle: "PNP Transistor Logic & Theory",
          fullWidth: true,
          canvasContent: <PnpTransistorSwitchingTheory />,
        },
        {
          key: "simulation",
          label: "Simulation CKT",
          canvasTitle: "Simulation CKT Canvas",
          panelTitle: "Control Panel",
          panelContent: <PnpTransistorSwitchingControlPanel />,
          canvasContent: <PnpTransistorSwitchingCircuit />,
          layout: "stacked",
        },
      ]}
    />
  );
}
