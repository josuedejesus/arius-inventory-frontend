enum variant {
  success = "success",
  warning = "warning",
  info = "info",
  danger = "danger",
  neutral = "neutral",
}

export const RETURN_STATUS_CONFIG: Record<string, {
     label: string; className: variant
}> = {
    NULL: { label: '-', className: variant.neutral },
    NONE: { label: 'Pendiente', className: variant.danger },
    FULL: { label: 'Completa', className: variant.success },
    PARTIAL: { label: 'Parcial', className: variant.warning },
};


