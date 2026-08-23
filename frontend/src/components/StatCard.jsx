export default function StatCard({ icon: Icon, iconBg, iconColor, label, value, delta, deltaColor }) {
  return (
    <div className="bg-navy-900 rounded-xl border border-white/10 shadow-sm p-5 flex-1 min-w-[180px]">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {delta && (
        <p className={`text-xs mt-1 font-medium ${deltaColor}`}>{delta}</p>
      )}
    </div>
  );
}
