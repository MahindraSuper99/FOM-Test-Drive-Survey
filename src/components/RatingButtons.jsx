const RATINGS = [
  { value: 'Excellent', className: 'bg-green-600 hover:bg-green-700 border-green-600' },
  { value: 'Good', className: 'bg-lime-500 hover:bg-lime-600 border-lime-500' },
  { value: 'Fair', className: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-500' },
  { value: 'Poor', className: 'bg-orange-500 hover:bg-orange-600 border-orange-500' },
  { value: 'Unacceptable', className: 'bg-[#E31837] hover:bg-[#c41430] border-[#E31837]' },
]

export default function RatingButtons({ value, onChange, hideSelection = false }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {RATINGS.map((rating) => {
        const isSelected = !hideSelection && value === rating.value
        return (
          <button
            key={rating.value}
            type="button"
            onClick={() => onChange(rating.value)}
            className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold text-white transition-all ${rating.className} ${
              isSelected
                ? 'ring-2 ring-offset-2 ring-[#1a1a1a] scale-[1.03]'
                : 'opacity-90 hover:opacity-100'
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
