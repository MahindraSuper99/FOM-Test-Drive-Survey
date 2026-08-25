export default function MahindraLogo({ className = '', wordmark = false, wordmarkClassName = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img src="/mahindra-logo.png" alt="Mahindra" className="h-full w-full object-contain" />
      {wordmark && (
        <span className={`mt-1.5 font-semibold tracking-wide ${wordmarkClassName}`}>mahindra</span>
      )}
    </div>
  )
}
