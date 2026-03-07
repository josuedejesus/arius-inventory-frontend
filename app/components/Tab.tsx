export default function Tab({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium rounded-t-md transition
        ${
          active
            ? "bg-white border border-b-0 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }
      `}
    >
      {label}
    </button>
  );
}
