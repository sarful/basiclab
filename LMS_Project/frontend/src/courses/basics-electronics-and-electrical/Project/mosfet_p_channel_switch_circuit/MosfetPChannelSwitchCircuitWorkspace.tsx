"use client";

import ProjectWorkspaceTemplate from "../library/templates/ProjectWorkspaceTemplate";
import MosfetPChannelSwitchCircuitControlPanel from "./control_panel";
import MosfetPChannelSwitchCircuit from "./MosfetPChannelSwitchCircuit";
import MosfetPChannelSwitchCircuitTheory from "./MosfetPChannelSwitchCircuitTheory";

function HeaderActions() {
  return (
    <div className="workspace-quickbar">
      <div className="workspace-quickbar-status">
        <span className="workspace-status-pill">VDD OFF</span>
        <span className="workspace-status-pill">Gate HIGH</span>
        <span className="workspace-status-pill">Load OFF</span>
      </div>
      <div className="workspace-quickbar-actions">
        <button type="button" className="workspace-quickbar-button is-mcb">
          VDD OFF
        </button>
        <button type="button" className="workspace-quickbar-button is-start">
          Gate LOW
        </button>
        <button type="button" className="workspace-quickbar-button is-stop">
          Gate HIGH
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

export default function MosfetPChannelSwitchCircuitWorkspace() {
  return (
    <ProjectWorkspaceTemplate
      badge="MOSFET P CHANNEL SWITCHING"
      title="MOSFET P CHANNEL SWITCH CIRCUIT WORKSPACE"
      initialTabKey="theory"
      headerActions={<HeaderActions />}
      tabs={[
        {
          key: "theory",
          label: "Logic & Theory",
          canvasTitle: "MOSFET P Channel Logic & Theory",
          fullWidth: true,
          canvasContent: <MosfetPChannelSwitchCircuitTheory />,
        },
        {
          key: "simulation",
          label: "Simulation CKT",
          canvasTitle: "Simulation CKT Canvas",
          panelTitle: "Control Panel",
          panelContent: <MosfetPChannelSwitchCircuitControlPanel />,
          canvasContent: <MosfetPChannelSwitchCircuit />,
          layout: "stacked",
        },
      ]}
    />
  );
}
