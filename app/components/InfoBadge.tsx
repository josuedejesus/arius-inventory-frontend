import { variant } from "@/constants/VarianEnum";
import { PrimaryBadge } from "./PrimaryBadge";

type Props = {
  label: string;
  icon?: React.ReactNode;
  classname?: string;
  variant?: variant;
  value?: string;
  badgeValue?: string;
};

export default function InfoBadge({
  label,
  icon,
  classname,
  variant,
  badgeValue,
  value,
}: Props) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {icon && <span className={`${classname}`}>{icon}</span>}
      <span className="text-gray-400">{label}:</span>

      <div className="flex items-center gap-1 font-medium text-gray-800">
        {value ? (
          <span>{value}</span>
        ) : (
          <PrimaryBadge label={badgeValue!} variant={variant!} />
        )}
      </div>
    </div>
  );
}
