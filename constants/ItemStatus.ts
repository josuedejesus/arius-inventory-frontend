enum variant {
  success = "success",
  warning = "warning",
  info = "info",
  danger = "danger",
  neutral = "neutral",
};


export const ITEM_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    className: variant;
  }
> = {
  CREATED: {
    label: "Creado",
    className: variant.neutral,
  },
  AVAILABLE: {
    label: "Disponible",
    className: variant.success,
  },
  RESERVED: {
    label: "Reservado",
    className: variant.info,
  },
  RENTED: {
    label: "Rentado",
    className: variant.danger,
  },
  IN_TRANSIT: {
    label: "En Transito",
    className: variant.warning,
  },
};
