// utils/phone.ts

export const formatHNPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

export const isValidHNPhone = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 8) return false;
  // Honduras: empieza con 2 (fijo) o 3, 7, 8, 9 (móvil)
  return /^[23789]/.test(digits);
};

export const unformatPhone = (value: string): string => {
  return value.replace(/\D/g, '');
};