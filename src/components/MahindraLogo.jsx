export default function MahindraLogo({ className = '', wordmark = false, wordmarkClassName = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 100 80"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M14 8 C 26 22, 36 48, 48 74" />
        <path d="M86 8 C 74 22, 64 48, 52 74" />
      </svg>
      {wordmark && (
        <span className={`mt-1 text-[10px] font-semibold tracking-[0.2em] uppercase ${wordmarkClassName}`}>
          Mahindra
        </span>
      )}
    </div>
  )
}
