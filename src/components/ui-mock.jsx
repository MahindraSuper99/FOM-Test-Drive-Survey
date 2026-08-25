// Lightweight, dependency-free UI primitives styled to the brand theme.

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function Button({
  className = '',
  variant = 'primary',
  disabled = false,
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-[#E31837] text-white hover:bg-[#c41430] focus:ring-[#E31837]',
    secondary:
      'bg-gray-100 text-[#1a1a1a] hover:bg-gray-200 focus:ring-gray-300',
    outline:
      'border border-gray-300 bg-white text-[#1a1a1a] hover:bg-gray-50 focus:ring-gray-300',
  }

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export function Checkbox({ id, checked, onChange, className = '', ...props }) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`h-5 w-5 rounded border-gray-300 text-[#E31837] focus:ring-[#E31837] cursor-pointer ${className}`}
      {...props}
    />
  )
}

export function Label({ htmlFor, className = '', children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-[#1a1a1a] ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-gray-300 p-3 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E31837] focus:border-transparent ${className}`}
      {...props}
    />
  )
}
