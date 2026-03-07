import { useState } from "react";
import Modal from "./Modal";

type ItemSelectionProps = {
  items: any[];
  selected: any;
  onAccept: (item: any) => void; 
};

export default function ItemSelection({ items, selected, onAccept }: ItemSelectionProps) {

  const [selectedItem, setSelectedItem] = useState<any>(selected);

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-4 text-xs text-gray-400 uppercase px-2">
          <span></span>
          <span>Nombre</span>
        </div>

        {/* Rows */}
        {items.map((u: any) => (
          <label
            key={u.id}
            className="grid grid-cols-4 items-center px-2 py-1.5
                       text-sm cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              name="selectedUser"
              checked={selectedItem?.id == u.id}
              onChange={() => setSelectedItem(u)}
              className="text-blue-600 focus:ring-blue-500"
            />

            <span className="text-gray-800 truncate">{u.name}</span>
            <span className="text-gray-600 truncate">{u.username}</span>
            <span className="text-gray-500 truncate">{u.role}</span>
          </label>
        ))}
      </div>

      <div className="flex items-end justify-end">
        <button
          onClick={() => onAccept(selectedItem)}
          type="button"
          className="p-2 hover:bg-blue-500 rounded-md text-white bg-blue-400"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
