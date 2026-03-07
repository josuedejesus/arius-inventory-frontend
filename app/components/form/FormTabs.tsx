type TabOption = {
  key: string;
  label: string;
};

type FormTabsProps = {
  tabs: TabOption[];
  value: string;
  onChange: (key: string) => void;
};

export default function FormTabs({ tabs, value, onChange }: FormTabsProps) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`relative px-4 py-1.5 text-sm rounded-md transition-all duration-200
            ${
              value === tab.key
                ? "bg-white shadow text-blue-600 font-medium scale-[1.02]"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            }`}
          style={{
            transition: "background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}