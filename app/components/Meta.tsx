export default function Meta({ label, value }: any) {
  return (
    <div className="rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-gray-700">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value ?? "—"}</p>
    </div>
  );
}
