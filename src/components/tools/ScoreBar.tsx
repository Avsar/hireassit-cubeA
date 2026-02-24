type Props = {
  score: number;
  max?: number;
};

export default function ScoreBar({ score, max = 5 }: Props) {
  const pct = Math.round((score / max) * 100);

  const color =
    score <= 2 ? "bg-red-500" : score === 3 ? "bg-amber-400" : "bg-green-500";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-8 text-right">
        {score}/{max}
      </span>
    </div>
  );
}
