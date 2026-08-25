import { Button, Checkbox, Label, Textarea } from './ui-mock.jsx'

export default function FeedbackTextarea({
  wantsToComment,
  onWantsToCommentChange,
  comment,
  onCommentChange,
  consent,
  onConsentChange,
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="block mb-2">Would you like to leave a comment?</Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={wantsToComment === true ? 'primary' : 'outline'}
            onClick={() => onWantsToCommentChange(true)}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={wantsToComment === false ? 'primary' : 'outline'}
            onClick={() => onWantsToCommentChange(false)}
          >
            No
          </Button>
        </div>
      </div>

      {wantsToComment === true && (
        <div>
          <Label htmlFor="comment">
            Your comment <span className="text-[#E31837]">(mandatory)</span>
          </Label>
          <Textarea
            id="comment"
            rows={5}
            className="mt-1"
            value={comment}
            onChange={(event) => onCommentChange(event.target.value)}
            placeholder="Tell us about your experience"
          />
        </div>
      )}

      {wantsToComment !== null && (
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-3">
          <Checkbox
            id="feedback-consent"
            checked={consent}
            onChange={(event) => onConsentChange(event.target.checked)}
            className="mt-0.5"
          />
          <Label htmlFor="feedback-consent" className="cursor-pointer font-normal">
            I consent to my feedback being processed in accordance with the Protection of
            Personal Information Act (POPIA) for the purpose of improving dealership service
            quality.
          </Label>
        </div>
      )}
    </div>
  )
}
