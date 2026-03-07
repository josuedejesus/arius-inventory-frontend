type NumberSelectorProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min: number;
  max: number;
};
export default function NumberSelector({
  value = 0,
  onIncrease,
  onDecrease,
  min,
  max,
}: NumberSelectorProps) {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-xl">
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 text-lg font-semibold hover:bg-gray-300 active:scale-95 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        −
      </button>

      <div className="min-w-[48px] text-center bg-white rounded-lg py-1.5 px-2 text-sm font-semibold text-gray-800">
        {value}
      </div>

      <button
        type="button"
        onClick={onIncrease}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 text-lg font-semibold hover:bg-gray-300 active:scale-95 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        +
      </button>
    </div>
  );
}
