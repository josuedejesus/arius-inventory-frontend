type FormTabPanelProps = {
  when: string;
  value: string;
  children: React.ReactNode;
};

export default function FormTabPanel({ when, value, children }: FormTabPanelProps) {
  if (when !== value) return null;

  return (
    <div
      className="mt-6"
      style={{
        animation: "tabIn 0.18s ease-out both",
      }}
    >
      {children}
      <style>{`
        @keyframes tabIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}