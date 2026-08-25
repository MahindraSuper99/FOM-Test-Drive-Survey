export default function MahindraLogo({ className = '', wordmark = false, wordmarkClassName = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img src="/mahindra-logo.png" alt="Mahindra" className="h-full w-full object-contain" />
      {wordmark && (
        <span className={`mt-1 text-[10px] font-semibold tracking-[0.2em] uppercase ${wordmarkClassName}`}>
          Mahindra
        </span>
      )}
    </div>
  )
}
