const RATINGS = [
  { value: 'Excellent', className: 'bg-[#2fa876] hover:bg-[#279368]' },
  { value: 'Good', className: 'bg-[#9bcb54] hover:bg-[#8cbd45]' },
  { value: 'Fair', className: 'bg-[#f3b84e] hover:bg-[#eeac36]' },
  { value: 'Poor', className: 'bg-[#f2907f] hover:bg-[#ef7c68]' },
  { value: 'Unacceptable', className: 'bg-[#e37a95] hover:bg-[#df6284]' },
]

export default function RatingButtons({ value, onChange, hideSelection = false }) {
  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
      {RATINGS.map((rating) => {
        const isSelected = !hideSelection && value === rating.value
        return (
          <button
            key={rating.value}
            type="button"
            onClick={() => onChange(rating.value)}
            className={`min-w-0 rounded-lg px-0.5 py-2.5 text-center text-[10px] sm:text-xs leading-tight break-words font-semibold text-white transition-all ${rating.className} ${
              isSelected
                ? 'ring-2 ring-offset-1 ring-[#1a1a1a] scale-[1.03]'
                : 'opacity-95 hover:opacity-100'
            }`}
            aria-pressed={isSelected}
          >
            {rating.value}
          </button>
        )
      })}
    </div>
  )
}

export { RATINGS }
