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
  const diffInSeconds = Math.floor(
    (now.getTime() - past.getTime()) / 1000
  );

  const intervals: {
    unit: Intl.RelativeTimeFormatUnit;
    seconds: number;
  }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      const rtf = new Intl.RelativeTimeFormat('es', {
        numeric: 'auto',
      });

      return rtf.format(-count, interval.unit);
    }
  }

  return 'justo ahora';
}


