export const formatHNRTN = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 14);

  if (digits.length <= 4) return digits;
  if (digits.length <= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
};

export const isValidHNRTN = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');

  // Debe tener exactamente 14 dígitos
  if (digits.length !== 14) return false;

  // Validación básica: solo números
  return /^\d{14}$/.test(digits);
};

export const unformatRTN = (value: string): string => {
  return value.replace(/\D/g, '');
};