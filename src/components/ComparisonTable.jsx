// Placeholder channel data — illustrative markups, not live figures.
// In Phase 2 this becomes real data fetched from the backend.
const CHANNEL_MARKUPS = [
  { name: "Bank Transfer", markup: 0.045 },
  { name: "Mobile Money (M-Pesa)", markup: 0.03 },
  { name: "Western Union", markup: 0.06 },
];

export default function ComparisonTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Typical channel markups</h3>
      <table className="w-full text-left">
        <tbody>
          {CHANNEL_MARKUPS.map((c) => (
            <tr key={c.name} className="border-b border-slate-100 last:border-0">
              <td className="py-2 text-slate-700">{c.name}</td>
              <td className="py-2 text-slate-500">~{(c.markup * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}