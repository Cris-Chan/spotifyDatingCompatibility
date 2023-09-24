export default function LineGraph({
  label,
  currentValue,
  totalValueAvailable,
}) {
  return (
    <div className="min-w-full flex flex-col gap-1">
      <h1>{label}</h1>
      <div className="relative h-10">
        <div className="h-10 w-full border-8 border-black absolute rounded-full" />
        <div
          className="h-10 bg-black absolute rounded-full"
          style={{ width: `${(currentValue / totalValueAvailable) * 100}%` }}
        />
      </div>
    </div>
  );
}
