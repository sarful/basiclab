import LayerCard from "./LayerCard";
import { TRANSISTOR_LAYER_CARDS } from "./transistorStructureContent";

export default function TransistorLayerOverview() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {TRANSISTOR_LAYER_CARDS.map((card) => (
        <LayerCard
          key={card.title}
          title={card.title}
          color={card.color}
          doping={card.doping}
          description={card.description}
        />
      ))}
    </div>
  );
}
