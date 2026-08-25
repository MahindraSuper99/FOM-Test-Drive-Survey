import { Checkbox, Label } from './ui-mock.jsx'

export const REASONS = [
  'Route was not suitable for the vehicle',
  'Sales Consultant was not knowledgeable about the vehicle',
  'Insufficient time given for the test drive',
  'Vehicle was not clean or well-presented',
  'The Sales Executive / Consultant did not explain vehicle features before the drive',
  'The Sales Executive / Consultant was not present during the test drive',
  'Vehicle had a technical issue during the test drive',
  'Dealership Amenities not satisfactory',
  'Other',
]

const FACILITIES = ['Parking', 'Waiting area', 'Restrooms', 'Signage', 'Cleanliness']

const AMENITIES_REASON = 'Dealership Amenities not satisfactory'
const OTHER_REASON = 'Other'

export default function ReasonSelector({
  selectedReasons,
  onToggleReason,
  facility,
  onFacilityChange,
  otherDetail,
  onOtherDetailChange,
}) {
  return (
    <div className="space-y-3">
      {REASONS.map((reason) => {
        const checked = selectedReasons.includes(reason)
        const inputId = `reason-${reason}`
        return (
          <div key={reason} className="space-y-2">
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-3">
              <Checkbox
                id={inputId}
                checked={checked}
                onChange={() => onToggleReason(reason)}
                className="mt-0.5"
              />
              <Label htmlFor={inputId} className="cursor-pointer">
                {reason}
              </Label>
            </div>

            {reason === AMENITIES_REASON && checked && (
              <div className="ml-8 pl-3">
                <Label htmlFor="facility-select">
                  Which facility? <span className="text-gray-400">(optional)</span>
                </Label>
                <select
                  id="facility-select"
                  value={facility ?? ''}
                  onChange={(event) => onFacilityChange(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E31837] focus:border-transparent"
                >
                  <option value="">Select a facility</option>
                  {FACILITIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {reason === OTHER_REASON && checked && (
              <div className="ml-8 pl-3">
                <Label htmlFor="other-detail">
                  Please specify <span className="text-[#E31837]">(mandatory)</span>
                </Label>
                <input
                  id="other-detail"
                  type="text"
                  value={otherDetail ?? ''}
                  onChange={(event) => onOtherDetailChange(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E31837] focus:border-transparent"
                  placeholder="Tell us more"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
