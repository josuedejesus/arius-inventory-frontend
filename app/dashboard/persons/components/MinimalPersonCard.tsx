import { useState } from "react";
import { PersonViewModel } from "../types/person-view-model";
import { PERSON_ROLE_LABELS } from "@/constants/PersonRoles";
import { MdMail, MdPhone } from "react-icons/md";

type Props = {
  person: PersonViewModel;
};

export default function MinimalPersonCard({ person }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {person.name}
        </p>

        <p className="text-xs text-gray-400 truncate">
          {PERSON_ROLE_LABELS[person.role as any] || "Sin rol"}
        </p>

        <div className="flex gap-2 mt-1 flex-wrap text-gray-500">
          {person.email && (
            <button
              onClick={() => handleCopy(person.email, "email")}
              className="text-xs bg-white border px-2 py-0.5 rounded hover:bg-gray-200 transition"
            >
              <MdMail className="inline-block mr-1"/> {copied === "email" ? "Copiado" : person.email}
            </button>
          )}

          {person.phone && (
            <button
              onClick={() => handleCopy(person.phone, "phone")}
              className="text-xs bg-white border px-2 py-0.5 rounded hover:bg-gray-200 transition"
            >
              <MdPhone className="inline-block mr-1"/> {copied === "phone" ? "Copiado" : person.phone}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}