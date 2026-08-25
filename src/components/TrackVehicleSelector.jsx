import { Label } from './ui-mock.jsx'
import { TRACKS, TRACK_NAMES } from '../utils/vehicles.js'

const selectClassName =
  'mt-1 w-full rounded-xl border border-gray-300 p-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E31837] focus:border-transparent'

export default function TrackVehicleSelector({ track, onTrackChange, vehicle, onVehicleChange }) {
  const vehicleOptions = track ? TRACKS[track] : []

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="track-select">Which track did you drive on?</Label>
        <select
          id="track-select"
          value={track ?? ''}
          onChange={(event) => onTrackChange(event.target.value)}
          className={selectClassName}
        >
          <option value="">Select a track</option>
          {TRACK_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {track && (
        <div>
          <Label htmlFor="vehicle-select">Which vehicle did you drive?</Label>
          <select
            id="vehicle-select"
            value={vehicle ?? ''}
            onChange={(event) => onVehicleChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">Select a vehicle</option>
            {vehicleOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
