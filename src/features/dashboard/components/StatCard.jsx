function StatCard({ name, value, color }) {
  return (
    <div className="bg-axifarma rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col items-start">
      <h3 className={`text-4xl font-bold mb-2 ${color}`}>{value}</h3>
      <p className="text-xs font-semibold text-slate-500">{name}</p>
    </div>
  );
}
export default StatCard;
