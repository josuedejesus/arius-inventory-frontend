type Props = {
  icon: React.ReactNode;
  label: string;
  value: string;
};
export default function InfoCard({ icon, label, value }: Props) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
      <div className="text-gray-400 text-lg">{icon}</div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}</span>
      </div>
    </div>
  );
}
