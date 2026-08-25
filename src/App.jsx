import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Checkbox, Label, Textarea } from './components/ui-mock.jsx'
import RatingButtons from './components/RatingButtons.jsx'
import ReasonSelector from './components/ReasonSelector.jsx'
import FeedbackTextarea from './components/FeedbackTextarea.jsx'
import ProgressStepper from './components/ProgressStepper.jsx'
import { sanitizeInput, formatDateLocal, isExpired } from './utils/helpers.js'

const LOW_RATINGS = ['Poor', 'Unacceptable']

function useUrlParams() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      surveyId: params.get('id') ?? '',
      dealer: params.get('dealer') ?? '',
      expires: params.get('expires') ?? '',
    }
  }, [])
}

function useLiveClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return now
}

function VehicleRatingRow({ label, value, onChange, feedback, onFeedbackChange }) {
  const showElaboration = LOW_RATINGS.includes(value)

  return (
    <div className="space-y-2">
      <Label className="block">{label}</Label>
      <RatingButtons value={value} onChange={onChange} />
      {showElaboration && (
        <div>
          <Label htmlFor={`${label}-feedback`} className="block mt-2">
            Tell us more <span className="text-gray-400">(optional)</span>
          </Label>
          <Textarea
            id={`${label}-feedback`}
            rows={3}
            className="mt-1"
            value={feedback}
            onChange={(event) => onFeedbackChange(event.target.value)}
            placeholder="What went wrong?"
          />
        </div>
      )}
    </div>
  )
}

export default function App() {
  const { surveyId, dealer, expires } = useUrlParams()
  const now = useLiveClock()
  const dealerName = dealer || 'our dealership'

  const [screen, setScreen] = useState('welcome')
  const [welcomeConsent, setWelcomeConsent] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const [overallExperience, setOverallExperience] = useState(null)

  const [selectedReasons, setSelectedReasons] = useState([])
  const [facility, setFacility] = useState('')
  const [otherDetail, setOtherDetail] = useState('')

  const [vehiclePerformance, setVehiclePerformance] = useState(null)
  const [vehicleComfort, setVehicleComfort] = useState(null)
  const [vehicleFeatures, setVehicleFeatures] = useState(null)
  const [vehiclePerformanceFeedback, setVehiclePerformanceFeedback] = useState('')
  const [vehicleComfortFeedback, setVehicleComfortFeedback] = useState('')
  const [vehicleFeaturesFeedback, setVehicleFeaturesFeedback] = useState('')

  const [wantsToComment, setWantsToComment] = useState(null)
  const [comment, setComment] = useState('')
  const [feedbackConsent, setFeedbackConsent] = useState(false)

  const [submittedAt, setSubmittedAt] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const expired = isExpired(expires)

  const isDissatisfied = LOW_RATINGS.includes(overallExperience)

  const steps = useMemo(() => {
    const list = ['overall']
    if (isDissatisfied) list.push('dissatisfaction')
    list.push('vehicle', 'feedback')
    return list
  }, [isDissatisfied])

  const currentStep = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  function toggleReason(reason) {
    setSelectedReasons((previous) =>
      previous.includes(reason)
        ? previous.filter((item) => item !== reason)
        : [...previous, reason],
    )
    if (reason === 'Other' && selectedReasons.includes('Other')) {
      setOtherDetail('')
    }
    if (reason === 'Dealership Amenities not satisfactory' && selectedReasons.includes(reason)) {
      setFacility('')
    }
  }

  function canProceed() {
    if (currentStep === 'overall') return Boolean(overallExperience)
    if (currentStep === 'dissatisfaction') {
      if (selectedReasons.length === 0) return false
      if (selectedReasons.includes('Other') && otherDetail.trim() === '') return false
      return true
    }
    if (currentStep === 'vehicle') {
      return Boolean(vehiclePerformance && vehicleComfort && vehicleFeatures)
    }
    if (currentStep === 'feedback') {
      if (wantsToComment === null) return false
      if (wantsToComment && comment.trim() === '') return false
      return feedbackConsent
    }
    return false
  }

  function handleNext() {
    if (!canProceed()) return
    if (isLastStep) {
      handleSubmit()
      return
    }
    setStepIndex((index) => index + 1)
  }

  function handleBack() {
    setStepIndex((index) => Math.max(0, index - 1))
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setSubmitError('')

    const submissionDate = new Date()
    const hasLowRating =
      isDissatisfied ||
      LOW_RATINGS.includes(vehiclePerformance) ||
      LOW_RATINGS.includes(vehicleComfort) ||
      LOW_RATINGS.includes(vehicleFeatures)

    const payload = {
      name: '',
      surveyId,
      dealer,
      submittedDate: submissionDate.toISOString(),
      submittedDateLocal: formatDateLocal(submissionDate),
      device: navigator.userAgent,
      responseType: 'Customer',
      reviewStatus: 'New',
      overallExperience,
      dissatisfactionReasons: isDissatisfied ? selectedReasons : null,
      unsatisfactoryFacility:
        isDissatisfied && selectedReasons.includes('Dealership Amenities not satisfactory')
          ? facility || null
          : null,
      otherReasonDetail:
        isDissatisfied && selectedReasons.includes('Other')
          ? sanitizeInput(otherDetail.trim())
          : null,
      vehiclePerformance,
      vehicleComfort,
      vehicleFeatures,
      vehiclePerformanceFeedback: sanitizeInput(vehiclePerformanceFeedback.trim()) || null,
      vehicleComfortFeedback: sanitizeInput(vehicleComfortFeedback.trim()) || null,
      vehicleFeaturesFeedback: sanitizeInput(vehicleFeaturesFeedback.trim()) || null,
      hasLowRating,
      notes: wantsToComment ? sanitizeInput(comment.trim()) : '',
      popiaConsent: welcomeConsent,
      feedbackConsent,
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Submission failed')

      setSubmittedAt(submissionDate)
      setScreen('complete')
    } catch {
      setSubmitError('Something went wrong submitting your survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">Survey Expired</h1>
          <p className="text-gray-600">
            This survey link has expired and is no longer accepting responses. Please contact
            the dealership if you believe this is an error.
          </p>
        </Card>
      </div>
    )
  }

  if (screen === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 text-green-600">
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.415l-7.25 7.25a1 1 0 01-1.415 0l-3.25-3.25a1 1 0 111.415-1.415L8.75 11.836l6.543-6.543a1 1 0 011.411-.003z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully and will help us improve your
            experience at {dealerName}.
          </p>
          {submittedAt && (
            <p className="text-xs text-gray-400">Submitted {formatDateLocal(submittedAt)}</p>
          )}
        </Card>
      </div>
    )
  }

  if (screen === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full overflow-hidden">
          <div className="bg-[#E31837] px-6 py-6 text-center">
            <div className="text-white text-2xl font-extrabold tracking-tight">MAHINDRA</div>
            <p className="text-white/90 text-sm mt-1">Test Drive Experience Survey</p>
          </div>

          <div className="p-6 space-y-5">
            <p className="text-center text-sm text-gray-500">
              {now.toLocaleDateString('en-ZA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              &middot; {now.toLocaleTimeString('en-ZA')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-100 p-4 text-center">
                <p className="text-sm font-semibold text-[#1a1a1a]">Takes about 2 minutes</p>
                <p className="text-xs text-gray-500 mt-1">Quick and easy to complete</p>
              </div>
              <div className="rounded-xl bg-gray-100 p-4 text-center">
                <p className="text-sm font-semibold text-[#1a1a1a]">Your data is protected</p>
                <p className="text-xs text-gray-500 mt-1">Handled in line with POPIA</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-3">
              <Checkbox
                id="welcome-consent"
                checked={welcomeConsent}
                onChange={(event) => setWelcomeConsent(event.target.checked)}
                className="mt-0.5"
              />
              <Label htmlFor="welcome-consent" className="cursor-pointer font-normal">
                I consent to my personal information being processed in accordance with the
                Protection of Personal Information Act (POPIA) for the purpose of this survey.
              </Label>
            </div>

            <Button
              className="w-full"
              disabled={!welcomeConsent}
              onClick={() => setScreen('survey')}
            >
              Start Survey
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full overflow-hidden">
        <div className="bg-[#E31837] px-6 py-4 text-center">
          <div className="text-white text-lg font-extrabold tracking-tight">MAHINDRA</div>
          <p className="text-white/90 text-xs mt-0.5">Test Drive Experience Survey</p>
        </div>

        <div className="p-6">
          <ProgressStepper stepCount={steps.length} currentStep={stepIndex + 1} />

          {currentStep === 'overall' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                How would you rate your overall Test Drive Experience at {dealerName}?
              </h2>
              <RatingButtons value={overallExperience} onChange={setOverallExperience} />
            </div>
          )}

          {currentStep === 'dissatisfaction' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                We're sorry to hear that. What could we have done better? Select all that apply.
              </h2>
              <ReasonSelector
                selectedReasons={selectedReasons}
                onToggleReason={toggleReason}
                facility={facility}
                onFacilityChange={setFacility}
                otherDetail={otherDetail}
                onOtherDetailChange={setOtherDetail}
              />
            </div>
          )}

          {currentStep === 'vehicle' && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                Based on your test drive at {dealerName}, how would you rate the following
                aspects of the vehicle?
              </h2>
              <VehicleRatingRow
                label="Overall performance"
                value={vehiclePerformance}
                onChange={setVehiclePerformance}
                feedback={vehiclePerformanceFeedback}
                onFeedbackChange={setVehiclePerformanceFeedback}
              />
              <VehicleRatingRow
                label="Level of comfort"
                value={vehicleComfort}
                onChange={setVehicleComfort}
                feedback={vehicleComfortFeedback}
                onFeedbackChange={setVehicleComfortFeedback}
              />
              <VehicleRatingRow
                label="Features"
                value={vehicleFeatures}
                onChange={setVehicleFeatures}
                feedback={vehicleFeaturesFeedback}
                onFeedbackChange={setVehicleFeaturesFeedback}
              />
            </div>
          )}

          {currentStep === 'feedback' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1a1a1a]">Almost done!</h2>
              <FeedbackTextarea
                wantsToComment={wantsToComment}
                onWantsToCommentChange={setWantsToComment}
                comment={comment}
                onCommentChange={setComment}
                consent={feedbackConsent}
                onConsentChange={setFeedbackConsent}
              />
            </div>
          )}

          {submitError && <p className="text-sm text-[#E31837] mt-4">{submitError}</p>}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack} disabled={stepIndex === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed() || isSubmitting}>
              {isLastStep ? (isSubmitting ? 'Submitting…' : 'Submit') : 'Next'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
