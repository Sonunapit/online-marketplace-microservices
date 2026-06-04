export default function AnalyticsCard({
  title,
  value,
  color = "bg-white",
}) {
  return (
    <div className={`${color} p-6 rounded-2xl shadow`}>
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}