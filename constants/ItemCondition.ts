enum variant {
  success = "success",
  warning = "warning",
  info = "info",
  danger = "danger",
  neutral = "neutral",
}

export const ITEM_CONDITION_CONFIG: Record<
  string,
  { label: string; className: variant }
> = {
  NEW: { label: "Nuevo", className: variant.success },
  GOOD: { label: "Bueno", className: variant.info },
  FAIR: { label: "Regular", className: variant.warning },
  DAMAGED: { label: "Dañado", className: variant.danger },
};
