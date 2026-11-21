import { useMemo } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const DEMO_DNCC_CENTER = [23.7937, 90.4066]

// These are illustrative neighborhood points, not official ward polygons or ward assignments.
function MapClick({ onPick }) {
  useMapEvents({ click(event) { onPick?.({ latitude: event.latlng.lat, longitude: event.latlng.lng }) } })
  return null
}

export default function MapView({ zones = [], reports = [], selected, onSelect, interactive = false, onPick }) {
  const points = useMemo(() => zones.map((zone) => ({
    ...zone,
    count: reports.filter((report) => report.zoneId === zone.id && report.status !== 'Resolved').length,
  })), [zones, reports])

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <MapContainer center={DEMO_DNCC_CENTER} zoom={12} scrollWheelZoom={false} className="h-[360px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {interactive && <MapClick onPick={onPick} />}
        {points.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.latitude, point.longitude]}
            radius={selected === point.id ? 12 : 9}
            pathOptions={{
              color: selected === point.id ? '#047857' : '#ffffff',
              weight: 2,
              fillColor: point.density >= 80 ? '#e11d48' : point.density >= 55 ? '#d97706' : '#059669',
              fillOpacity: 0.85,
            }}
            eventHandlers={{ click: () => onSelect?.(point.id) }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              <strong>{point.name}</strong><br />
              {point.count} open demo reports · {point.density}% illustrative issue index
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-3 py-2 text-[10px] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
        <span>OpenStreetMap · Dhaka North demonstration view</span>
        <span>Illustrative neighborhood points; not official DNCC ward boundaries</span>
      </div>
    </div>
  )
}
