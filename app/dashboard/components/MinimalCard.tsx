type Props = {
  topLabel?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onClick?: () => void;
};

export default function MinimalCard({
  topLabel,
  primaryLabel,
  secondaryLabel,
  onClick,
}: Props) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-100 border border-gray-100 hover:bg-gray-50 gap-3"
      onClick={onClick}
    >
      {/* Info */}
      <div className="min-w-0 flex-1">
        <span className="text-xs text-gray-500">{topLabel}</span>

        <p className="text-sm font-medium text-gray-700 truncate">
          {primaryLabel}
        </p>
        {secondaryLabel && (
          <p className="text-xs text-gray-500 truncate">
            {secondaryLabel && `${secondaryLabel}`}
          </p>
        )}
      </div>
    </div>
  );
}
