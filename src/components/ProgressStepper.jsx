export default function ProgressStepper({ stepCount, currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: stepCount }, (_, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                isCompleted
                  ? 'bg-[#E31837] text-white'
                  : isActive
                    ? 'border-2 border-[#E31837] text-[#E31837] bg-white'
                    : 'border-2 border-gray-300 text-gray-400 bg-white'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.415l-7.25 7.25a1 1 0 01-1.415 0l-3.25-3.25a1 1 0 111.415-1.415L8.75 11.836l6.543-6.543a1 1 0 011.411-.003z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            {stepNumber < stepCount && (
              <div
                className={`h-0.5 w-6 sm:w-10 transition-colors ${
                  isCompleted ? 'bg-[#E31837]' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
