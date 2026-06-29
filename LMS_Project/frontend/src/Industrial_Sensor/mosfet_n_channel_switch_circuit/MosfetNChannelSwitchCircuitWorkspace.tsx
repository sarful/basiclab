"use client";

import ProjectWorkspaceTemplate from "../../library/templates/ProjectWorkspaceTemplate";
import MosfetNChannelSwitchCircuitControlPanel from "./control_panel";
import MosfetNChannelSwitchCircuit from "./MosfetNChannelSwitchCircuit";
import MosfetNChannelSwitchCircuitTheory from "./MosfetNChannelSwitchCircuitTheory";

function HeaderActions() {
  return (
    <div className="workspace-quickbar">
      <div className="workspace-quickbar-status">
        <span className="workspace-status-pill">VDD OFF</span>
        <span className="workspace-status-pill">Gate IDLE</span>
        <span className="workspace-status-pill">Load OFF</span>
      </div>
      <div className="workspace-quickbar-actions">
        <button type="button" className="workspace-quickbar-button is-mcb">
          VDD OFF
        </button>
        <button type="button" className="workspace-quickbar-button is-start">
          Gate ON
        </button>
        <button type="button" className="workspace-quickbar-button is-stop">
          Gate OFF
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

export default function MosfetNChannelSwitchCircuitWorkspace() {
  return (
    <ProjectWorkspaceTemplate
      badge="MOSFET N CHANNEL SWITCHING"
      title="MOSFET N CHANNEL SWITCH CIRCUIT WORKSPACE"
      initialTabKey="theory"
      headerActions={<HeaderActions />}
      tabs={[
        {
          key: "theory",
          label: "Logic & Theory",
          canvasTitle: "MOSFET N Channel Logic & Theory",
          fullWidth: true,
          canvasContent: <MosfetNChannelSwitchCircuitTheory />,
        },
        {
          key: "simulation",
          label: "Simulation CKT",
          canvasTitle: "Simulation CKT Canvas",
          panelTitle: "Control Panel",
          panelContent: <MosfetNChannelSwitchCircuitControlPanel />,
          canvasContent: <MosfetNChannelSwitchCircuit />,
          layout: "stacked",
        },
      ]}
    />
  );
}
