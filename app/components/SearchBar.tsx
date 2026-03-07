import { IoMdSearch } from "react-icons/io";

type SearchBarProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};
export default function SearchBar({ value, placeholder, onChange }: SearchBarProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white w-full pl-10 pr-4 py-2 border rounded-lg text-sm text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-blue-500"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <IoMdSearch />
        </span>
      </div>
    </div>
  );
}
