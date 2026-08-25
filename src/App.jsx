import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Checkbox, Label, Textarea } from './components/ui-mock.jsx'
import RatingButtons from './components/RatingButtons.jsx'
import ReasonSelector from './components/ReasonSelector.jsx'
import FeedbackTextarea from './components/FeedbackTextarea.jsx'
import ProgressStepper from './components/ProgressStepper.jsx'
import MahindraLogo from './components/MahindraLogo.jsx'
import TrackVehicleSelector from './components/TrackVehicleSelector.jsx'
import { sanitizeInput, formatDateLocal, isExpired } from './utils/helpers.js'

const LOW_RATINGS = ['Poor', 'Unacceptable']

const STEP_SUBTITLES = {
  trackVehicle: 'Select the track you drove on, then the vehicle you drove',
  overall: 'Rate your overall test drive experience at the dealership',
  dissatisfaction: 'Help us understand what could have gone better',
  vehicle: 'Please rate each aspect of the vehicle separately',
  feedback: 'Share any additional thoughts about your experience',
}

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

function daysUntil(expires) {
  if (!expires) return null
  const expiryDate = new Date(expires)
  if (Number.isNaN(expiryDate.getTime())) return null
  const diff = Math.ceil((expiryDate.getTime() - Date.now()) / 86_400_000)
  return Math.max(0, diff)
}

function PageHeader() {
  return (
    <>
      <div className="h-1 bg-black w-full" />
      <div className="bg-[#E31837] w-full">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-3">
          <MahindraLogo className="h-8 w-8 text-white" wordmark wordmarkClassName="text-white/90" />
        </div>
      </div>
    </>
  )
}

function PageFooter() {
  return (
    <footer className="text-center text-xs text-gray-400 py-6">
      &copy; {new Date().getFullYear()} Mahindra South Africa. All rights reserved.
    </footer>
  )
}

function VehicleRatingRow({ letter, label, value, onChange, feedback, onFeedbackChange }) {
  const showElaboration = LOW_RATINGS.includes(value)

  return (
    <div className="space-y-2">
      <Label className="block text-slate-600">
        <span className="font-semibold">{letter})</span> {label}
      </Label>
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

  const [selectedTrack, setSelectedTrack] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)

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
  const validDays = daysUntil(expires)

  const isDissatisfied = LOW_RATINGS.includes(overallExperience)

  const steps = useMemo(() => {
    const list = ['trackVehicle', 'overall']
    if (isDissatisfied) list.push('dissatisfaction')
    list.push('vehicle', 'feedback')
    return list
  }, [isDissatisfied])

  const currentStep = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  function handleTrackChange(track) {
    setSelectedTrack(track)
    setSelectedVehicle(null)
  }

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
    if (currentStep === 'trackVehicle') return Boolean(selectedTrack && selectedVehicle)
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
      track: selectedTrack,
      vehicle: selectedVehicle,
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
      <div className="min-h-screen flex flex-col bg-gray-100">
        <PageHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 text-center">
            <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">Survey Expired</h1>
            <p className="text-gray-600">
              This survey link has expired and is no longer accepting responses. Please contact
              the dealership if you believe this is an error.
            </p>
          </Card>
        </div>
        <PageFooter />
      </div>
    )
  }

  if (screen === 'complete') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <PageHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-8 text-center">
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
        <PageFooter />
      </div>
    )
  }

  if (screen === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <PageHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <MahindraLogo className="h-16 w-16 text-gray-400 mb-4" />
              <h1 className="text-2xl font-bold text-[#1a1a1a]">Mahindra FOM Test Drive Experience</h1>
              <p className="text-[#E31837] font-semibold text-sm mt-1">Mahindra South Africa</p>
              <p className="text-gray-500 text-sm mt-3 max-w-sm">
                Thank you for test driving a Mahindra. Your feedback helps us improve our
                vehicles and services.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-gray-100 py-2.5 text-center">
              <p className="text-sm text-gray-600">
                {now.toLocaleDateString('en-ZA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at {now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl bg-gray-100 p-3 text-center">
                <p className="text-[11px] font-medium text-[#E31837]">Duration</p>
                <p className="text-sm font-semibold text-[#1a1a1a] mt-0.5">2-3 minutes</p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3 text-center">
                <p className="text-[11px] font-medium text-[#E31837]">Questions</p>
                <p className="text-sm font-semibold text-[#1a1a1a] mt-0.5">4 questions</p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3 text-center">
                <p className="text-[11px] font-medium text-[#E31837]">Valid for</p>
                <p className="text-sm font-semibold text-[#1a1a1a] mt-0.5">
                  {validDays === null ? 'Limited time' : `${validDays} day${validDays === 1 ? '' : 's'}`}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4 text-sm">
              <p className="font-semibold text-[#1a1a1a] mb-2">Privacy Notice (POPIA Compliance)</p>
              <p className="text-gray-500 mb-3">
                In accordance with the{' '}
                <span className="font-medium text-gray-600">
                  Protection of Personal Information Act (POPIA)
                </span>
                , we are committed to protecting your personal information and your right to
                privacy.
              </p>

              <p className="font-semibold text-[#1a1a1a] mb-1">What we collect:</p>
              <ul className="list-disc list-inside text-gray-500 space-y-0.5 mb-3">
                <li>Your satisfaction ratings and feedback responses</li>
                <li>Date and time the survey was completed</li>
                <li>Device and browser used to complete the survey</li>
              </ul>

              <p className="font-semibold text-[#1a1a1a] mb-1">How we use your information:</p>
              <ul className="list-disc list-inside text-gray-500 space-y-0.5 mb-3">
                <li>To improve our vehicles, products and services</li>
                <li>To address any concerns or issues raised in your feedback</li>
                <li>To generate anonymous statistical reports</li>
                <li>To follow up on low satisfaction ratings</li>
              </ul>

              <p className="font-semibold text-[#1a1a1a] mb-1">Your rights:</p>
              <ul className="list-disc list-inside text-gray-500 space-y-0.5 mb-3">
                <li>You may request access to your personal information</li>
                <li>You may request correction or deletion of your information</li>
                <li>You may withdraw consent at any time by contacting us</li>
              </ul>

              <p className="text-gray-400 text-xs">
                For queries about your personal information, contact Mahindra South Africa at{' '}
                <a href="mailto:privacy@mahindra.co.za" className="text-[#E31837] underline">
                  privacy@mahindra.co.za
                </a>
              </p>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E31837]/30 bg-[#E31837]/5 p-3">
              <Checkbox
                id="welcome-consent"
                checked={welcomeConsent}
                onChange={(event) => setWelcomeConsent(event.target.checked)}
                className="mt-0.5"
              />
              <Label htmlFor="welcome-consent" className="cursor-pointer font-normal">
                <span className="font-semibold">Required:</span> I have read and understand the
                Privacy Notice. I consent to Mahindra South Africa collecting, processing, and
                storing my feedback in accordance with POPIA for the purposes described above.
              </Label>
            </div>

            <Button
              className="w-full mt-4"
              disabled={!welcomeConsent}
              onClick={() => setScreen('survey')}
            >
              Start Survey
            </Button>
            <p className="text-center text-xs text-gray-400 mt-2">
              By proceeding, you confirm that you recently completed a Mahindra test drive.
            </p>
          </Card>
        </div>
        <PageFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <PageHeader />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-center text-sm text-gray-500 mb-2">Mahindra FOM Test Drive Experience</p>
        <ProgressStepper stepCount={steps.length} currentStep={stepIndex + 1} />

        <Card className="max-w-lg w-full p-6">
          {currentStep === 'trackVehicle' && (
            <div>
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                Which track and vehicle did you test drive at {dealerName}?
              </h2>
              <p className="text-sm text-slate-500 mt-1">{STEP_SUBTITLES.trackVehicle}</p>
              <hr className="border-gray-200 my-4" />
              <TrackVehicleSelector
                track={selectedTrack}
                onTrackChange={handleTrackChange}
                vehicle={selectedVehicle}
                onVehicleChange={setSelectedVehicle}
              />
            </div>
          )}

          {currentStep === 'overall' && (
            <div>
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                How would you rate your overall Test Drive Experience at {dealerName}?
              </h2>
              <p className="text-sm text-slate-500 mt-1">{STEP_SUBTITLES.overall}</p>
              <hr className="border-gray-200 my-4" />
              <RatingButtons value={overallExperience} onChange={setOverallExperience} />
            </div>
          )}

          {currentStep === 'dissatisfaction' && (
            <div>
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                We're sorry to hear that. What could we have done better?
              </h2>
              <p className="text-sm text-slate-500 mt-1">{STEP_SUBTITLES.dissatisfaction}</p>
              <hr className="border-gray-200 my-4" />
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
            <div>
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                Based on your test drive at {dealerName}, how would you rate the following
                aspects of the vehicle?
              </h2>
              <p className="text-sm text-slate-500 mt-1">{STEP_SUBTITLES.vehicle}</p>
              <hr className="border-gray-200 my-4" />
              <div className="space-y-5">
                <VehicleRatingRow
                  letter="a"
                  label="Overall performance"
                  value={vehiclePerformance}
                  onChange={setVehiclePerformance}
                  feedback={vehiclePerformanceFeedback}
                  onFeedbackChange={setVehiclePerformanceFeedback}
                />
                <VehicleRatingRow
                  letter="b"
                  label="Level of comfort"
                  value={vehicleComfort}
                  onChange={setVehicleComfort}
                  feedback={vehicleComfortFeedback}
                  onFeedbackChange={setVehicleComfortFeedback}
                />
                <VehicleRatingRow
                  letter="c"
                  label="Features"
                  value={vehicleFeatures}
                  onChange={setVehicleFeatures}
                  feedback={vehicleFeaturesFeedback}
                  onFeedbackChange={setVehicleFeaturesFeedback}
                />
              </div>
            </div>
          )}

          {currentStep === 'feedback' && (
            <div>
              <h2 className="text-base font-semibold text-[#1a1a1a]">
                Would you like to share any additional feedback about your test drive at{' '}
                {dealerName}?
              </h2>
              <p className="text-sm text-slate-500 mt-1">{STEP_SUBTITLES.feedback}</p>
              <hr className="border-gray-200 my-4" />
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

          <hr className="border-gray-200 my-4" />
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={stepIndex === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed() || isSubmitting}>
              {isLastStep ? (isSubmitting ? 'Submitting…' : 'Submit') : 'Next'}
            </Button>
          </div>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-4">
          Survey link valid for {validDays === null ? 'a limited time' : `${validDays} day${validDays === 1 ? '' : 's'}`}
          {' '}| Your data is protected under POPIA
        </p>
      </div>
      <PageFooter />
    </div>
  )
}
