import { Checkbox, Label } from './ui-mock.jsx'

export const REASONS = [
  'Insufficient time given for the test drive',
  'Vehicle was not clean or well-presented',
  'Vehicle had a technical issue during the test drive',
  'Mahindra Stand not satisfactory',
  'Other',
]

export const STAND_ISSUES = [
  'Too crowded/excessive waiting times to enter',
  'Staff lacked vehicle/tech knowledge',
  'Unclear test drive/track sign-up process',
  'Vehicles not well displayed',
]

const AMENITIES_REASON = 'Mahindra Stand not satisfactory'
const OTHER_REASON = 'Other'

export default function ReasonSelector({
  selectedReasons,
  onToggleReason,
  standIssues,
  onToggleStandIssue,
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
              <div className="ml-8 pl-3 space-y-2">
                <Label className="block">
                  What was the issue? <span className="text-[#E31837]">(mandatory)</span>
                </Label>
                {STAND_ISSUES.map((issue) => {
                  const issueChecked = standIssues.includes(issue)
                  const issueId = `stand-issue-${issue}`
                  return (
                    <div
                      key={issue}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 p-3"
                    >
                      <Checkbox
                        id={issueId}
                        checked={issueChecked}
                        onChange={() => onToggleStandIssue(issue)}
                        className="mt-0.5"
                      />
                      <Label htmlFor={issueId} className="cursor-pointer font-normal">
                        {issue}
                      </Label>
                    </div>
                  )
                })}
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
