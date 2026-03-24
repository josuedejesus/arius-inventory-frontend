export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString();
}

export const toDateInputValue = (date: string) =>
  date ? date.split("T")[0] : "";



export const formatNumber = (value: number | string) => {
  if (value === null || value === undefined || value === "") return "";

  const str = String(value);

  // Detecta cuántos decimales venían originalmente
  const decimals = str.includes(".")
    ? str.split(".")[1].length
    : 0;

  const num = Number(str);
  if (isNaN(num)) return "";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const timeAgo = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);

  const diffMs = now.getTime() - past.getTime();
  const diffInSeconds = Math.floor(diffMs / 1000);
  const diffInDaysExact = diffMs / 86400000;

  const rtf = new Intl.RelativeTimeFormat('es', {
    numeric: 'auto',
  });

  // 🔥 si ya cruzó 2 fechas calendario, usar días reales
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const pastDate = new Date(past.getFullYear(), past.getMonth(), past.getDate());

  const calendarDays =
    (nowDate.getTime() - pastDate.getTime()) / 86400000;

  if (calendarDays >= 2) {
    return rtf.format(-Math.floor(calendarDays), 'day');
  }

  // lógica normal (precisa)
  const intervals = [
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 },
    { unit: 'second' as const, seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return rtf.format(-count, interval.unit);
    }
  }

  return 'justo ahora';
};

export const timeAgoDetailed = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);

  let diffInSeconds = Math.floor(
    (now.getTime() - past.getTime()) / 1000
  );

  const days = Math.floor(diffInSeconds / 86400);
  diffInSeconds %= 86400;

  const hours = Math.floor(diffInSeconds / 3600);
  diffInSeconds %= 3600;

  const minutes = Math.floor(diffInSeconds / 60);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} día${days > 1 ? 's' : ''}`);
  }

  if (hours > 0) {
    parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  }

  if (minutes > 0 && days === 0) {
    // opcional: solo mostrar minutos si no hay días
    parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
  }

  if (parts.length === 0) {
    return 'justo ahora';
  }

  return `hace ${parts.join(' y ')}`;
};


