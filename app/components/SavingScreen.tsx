export default function SavingScreen() {
  return (
    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="flex items-center">
        <svg
          className="animate-spin h-8 w-8 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="ml-2 text-gray-600">Guardando...</span>
      </div>
    </div>
  );
}
