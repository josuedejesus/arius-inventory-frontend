import { title } from "process";

type FormSectionProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-4 p-2">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">{children}</div>
    </div>
  );
}
