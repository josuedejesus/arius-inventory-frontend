import Link from "next/link";

export interface Module {
  id: string;
  title: string;
  description: string;
  href: string;
}

export default function ModuleCard({ module }: { module: Module }) {
  return (
    <Link
      href={module.href}
      className="bg-white rounded-lg border hover:shadow-md transition p-6"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {module.title}
      </h2>
      <p className="text-sm text-gray-600">
        {module.description}
      </p>
    </Link>
  );
}
