export default function LineGraph({
  label,
  currentValue,
  totalValueAvailable,
}) {
  return (
    <div className="min-w-full flex flex-col gap-1">
      <h1>{label}</h1>
      <div className="relative h-12">
        <div className="h-12 w-full  bg-black absolute rounded-full" />

        <div
          className="h-12 bg-red-500 absolute rounded-full"
          style={{
            width: `${
              currentValue > totalValueAvailable * 0.1
                ? (currentValue / totalValueAvailable) * 100
                : 15
            }%`,
          }}
        />
        <div className="h-12 w-full border-8 border-black absolute rounded-full bg-transparent" />
      </div>
    </div>
  );
}
