function StatCard({ name,value }) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h3 className="text-sm text-gray-500">{name}</h3>

      <h3>{value}</h3>
    </div>
  );
}

export default StatCard;