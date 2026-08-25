export default function MahindraLogo({ className = '', wordmark = false, wordmarkClassName = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <polygon points="17,24 29,79 44,74 48,68" fill="currentColor" />
        <polygon points="83,24 71,79 56,74 52,68" fill="currentColor" />
      </svg>
      {wordmark && (
        <span className={`mt-1 text-[10px] font-semibold tracking-[0.2em] uppercase ${wordmarkClassName}`}>
          Mahindra
        </span>
      )}
    </div>
  )
}
