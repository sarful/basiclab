type LayerCardProps = {
  title: string;
  color: string;
  description: string;
  doping: string;
};

export default function LayerCard({
  title,
  color,
  description,
  doping,
}: LayerCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
      <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
        Doping Type: {doping}
      </div>
    </div>
  );
}
