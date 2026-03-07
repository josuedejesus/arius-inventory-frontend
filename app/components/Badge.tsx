type BadgeProps = {
  label: string;
  //color: string;
};
export default function Badge({ label }: BadgeProps) {
  return (
    <span
      className="
  inline-flex items-center gap-2
  rounded-full border border-gray-300
  px-3 py-1
  text-xs font-medium text-gray-700
  bg-gray-50
"
    >
      <span className="h-2 w-2 rounded-full bg-blue-500" />
      {label}
    </span>
  );
}
