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
      className={`
    inline-flex items-center gap-1.5
    text-[11px] font-medium
    px-2.5 py-0.5
    rounded-md
    whitespace-nowrap
    transition-colors
    cursor-pointer
    border
    uppercase
    ${value ? "text-green-600 bg-green-50 border-green-200" : "text-red-500 bg-red-50 border-red-200"}
  `}
      onClick={onClick}
    >
      {(trueIcon || falseIcon) && (
        <span className="text-xs">{value ? trueIcon : falseIcon}</span>
      )}

      {(trueLabel || falseLabel) && (
        <span>{value ? trueLabel : falseLabel}</span>
      )}
    </div>
  );
}
