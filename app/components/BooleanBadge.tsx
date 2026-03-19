type Props = {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
  trueIcon?: React.ReactNode;
  falseIcon?: React.ReactNode;
  onClick?: () => void;
};

export default function BooleanBadge({
  value,
  trueLabel,
  falseLabel,
  trueIcon,
  falseIcon,
  onClick,
}: Props) {
  return (
    <div
      className={`flex items-center px-2 py-1 rounded-md ${value ? "text-green-500 bg-green-100" : "text-red-400 bg-red-100"}`}
      onClick={onClick}
    >
      {trueIcon || falseIcon ? (
        <span className="text-sm">{value ? trueIcon : falseIcon}</span>
      ) : null}
      {trueLabel || falseLabel ? (
        <span className="ml-1">{value ? trueLabel : falseLabel}</span>
      ) : null}
    </div>
  );
}
