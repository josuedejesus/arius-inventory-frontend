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
      inline-flex items-center justify-center
      text-[11px] font-bold uppercase
      px-2 py-1.5
      rounded-md
      whitespace-nowrap
      transition-colors
      cursor-pointer
      leading-none
      ${value ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"}
    `}
    onClick={onClick}
  >
    <div className="flex items-center justify-center gap-1 w-full">
      
      {value ? trueIcon : falseIcon ? (
        <span className="flex items-center justify-center">
          {value ? trueIcon : falseIcon}
        </span>
      ) : null}

      {value ? trueLabel : falseLabel ? (
        <span className="flex items-center justify-center text-center">
          {value ? trueLabel : falseLabel}
        </span>
      ) : null}

    </div>
  </div>
);
}
