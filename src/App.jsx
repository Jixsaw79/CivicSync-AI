import { lazy, Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Building2, ClipboardList,
  Check, CheckCircle2, Clock3, CloudUpload, Download, FileImage, Filter,
  Gauge, Layers3, Leaf, MapPin, Menu, MessageSquareText, Moon, Navigation,
  Plus, Radio, RotateCcw, Search, ShieldCheck, Sparkles, Sun, TrendingUp, Users, Wallet,
  X, Zap, Image as ImageIcon,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { allocationData, initialReports, zones } from './data'
import { loadStoredReports, readThemePreference } from './storage'

const MapView = lazy(() => import('./MapView'))

const money = (value) => '$' + Number(value).toLocaleString('en-US')

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800',
  Assigned: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-800',
  Dispatched: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800',
  'In progress': 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-800',
  Resolved: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
}

const severityTone = (score) =>
  score >= 85
    ? 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40'
    : score >= 65
    ? 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40'
    : 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40'

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-800 text-white shadow-sm dark:bg-emerald-600">
        <Activity size={21} />
      </div>
      <div>
        <div className="font-display text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-white">
          CivicSync <span className="text-emerald-700 dark:text-emerald-400">AI</span>
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Urban intelligence</div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, detail, icon: Icon, trend, trendUp = false, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  }
  return (
    <div className="panel p-5 card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon size={19} />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="font-display text-[30px] font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</div>
        {trend && (
          <span className={`mb-1 inline-flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{detail}</p>
    </div>
  )
}

function SectionHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function ZoneMap({ selected, onSelect, reports, onReportSelect }) {
  return (
    <div className="panel p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Geospatial issue overview</div>
          <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">Dhaka North demonstration map</div>
        </div>
        <div className="flex gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Low</span>
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-amber-500" />Medium</span>
          <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-rose-500" />High</span>
        </div>
      </div>
      <Suspense fallback={<div className="grid h-[390px] place-items-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400" role="status">Loading interactive map…</div>}>
        <MapView zones={zones} reports={reports} selected={selected} onSelect={(id) => onSelect(selected === id ? null : id)} onReportSelect={onReportSelect} />
      </Suspense>
      {selected && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 text-sm dark:bg-emerald-950/40">
          <span className="font-semibold text-emerald-900 dark:text-emerald-200">
            {zones.find((z) => z.id === selected)?.name} selected
          </span>
          <button onClick={() => onSelect(null)} className="text-xs font-bold text-emerald-800 underline dark:text-emerald-300">Clear filter</button>
        </div>
      )}
    </div>
  )
}

function ReportTable({ reports, onDispatch, onStart, onResolve, onSelect, canManage = true }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <div className="font-display font-extrabold text-slate-900 dark:text-white">Priority maintenance queue</div>
          <div className="mt-0.5 text-xs text-slate-400">Ranked by urgency and estimated public impact</div>
        </div>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {reports.length} tickets
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-800/80 dark:text-slate-500">
            <tr>
              <th className="px-5 py-3">Issue / Zone</th>
              <th className="px-4 py-3">Urgency</th>
              <th className="px-4 py-3">People impacted</th>
              <th className="px-4 py-3">Est. cost</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((r) => (
              <tr key={r.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                <td className="px-5 py-4">
                  <button onClick={() => onSelect(r)} className="text-left">
                    <div className="font-bold text-slate-800 hover:text-emerald-800 dark:text-slate-100 dark:hover:text-emerald-300">
                      {r.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {r.zone} · {r.id}
                      {r.imageData && (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                          <ImageIcon size={11} /> photo
                        </span>
                      )}
                    </div>
                  </button>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded-lg px-2 py-1 text-xs font-extrabold ${severityTone(r.severity)}`}>
                    {r.severity}/100
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-300">{r.impact.toLocaleString()}</td>
                <td className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-300">{money(r.cost)}</td>
                <td className="px-4 py-4">
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyles[r.status] || statusStyles.Pending}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {!canManage ? (
                    <span className="text-xs font-medium text-slate-400">Staff access only</span>
                  ) : r.status === 'Pending' || r.status === 'Assigned' ? (
                    <button
                      onClick={() => onDispatch(r.id)}
                      className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                      Dispatch crew
                    </button>
                  ) : r.status === 'Dispatched' ? (
                    <button
                      onClick={() => onStart(r.id)}
                      className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-xs font-bold text-sky-800 transition hover:bg-sky-50 dark:border-sky-800 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-sky-950/40"
                    >
                      Start work
                    </button>
                  ) : r.status === 'In progress' ? (
                    <button
                      onClick={() => onResolve(r.id)}
                      className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Completed</span>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={28} className="text-slate-300 dark:text-slate-600" />
                    <p>No reports match the current filters.</p>
                    <p className="text-xs">Try clearing the zone filter or search query.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function useDialogAccessibility(open, onClose) {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement
    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const getFocusable = () => Array.from(dialogRef.current?.querySelectorAll(focusableSelector) || [])
    const firstFocusable = getFocusable()[0]
    ;(firstFocusable || dialogRef.current)?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = getFocusable()
      if (!items.length) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [open])

  return dialogRef
}

function ReportModal({ report, onClose }) {
  const dialogRef = useDialogAccessibility(!!report, onClose)

  if (!report) return null

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div
        className="modal-panel w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="eyebrow">Report details · {report.id}</div>
            <h3 id="report-modal-title" className="mt-1 font-display text-xl font-extrabold text-slate-900 dark:text-white">
              {report.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {report.imageData && (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <img src={report.imageData} alt="Issue evidence" className="max-h-48 w-full object-cover" />
          </div>
        )}

        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{report.description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            ['Category', report.category],
            ['Zone', report.zone],
            ['Assigned unit', report.unit],
            ['Est. repair', money(report.cost)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</div>
              <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Response history</div>
          <div className="mt-3 space-y-3">
            {(report.history?.length ? report.history : [{ status: 'Submitted', note: 'Seeded demonstration report.', at: null }, ...(report.status !== 'Pending' && report.status !== 'Assigned' ? [{ status: report.status, note: 'Current demonstration status.', at: null }] : [])]).map((entry, index) => (
              <div key={entry.status + index} className="flex gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{entry.status}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{entry.note}</p>
                  {entry.at && <p className="mt-0.5 text-[10px] text-slate-400">{new Date(entry.at).toLocaleString()}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {report.aiSummary ? (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles size={14} /> AI triage · {report.triageProvider || 'Gemini'}
              </div>
              {Number.isFinite(report.confidence) && (
                <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                  {Math.round(report.confidence * 100)}% confidence
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-5 text-emerald-950 dark:text-emerald-100">{report.aiSummary}</p>
            <p className="mt-2 text-xs text-emerald-900 dark:text-emerald-200">
              Severity score {report.severity}/100 · {report.duplicate}
            </p>
            {Array.isArray(report.safetyFlags) && report.safetyFlags.length > 0 && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-900 dark:bg-amber-950/40">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Safety flags for staff review</div>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-amber-900 dark:text-amber-200">
                  {report.safetyFlags.map((flag, index) => <li key={index}>{flag}</li>)}
                </ul>
              </div>
            )}
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/70 p-2 text-xs text-emerald-900 dark:bg-slate-900/50 dark:text-emerald-200">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" />
              <span>AI-generated decision support only. A staff member must verify the classification, severity and safety flags before taking action.</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <Sparkles size={14} /> Synthetic demo triage
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Severity score {report.severity}/100 · {report.duplicate}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">This sample record was not analyzed by Gemini. Its values are illustrative and require human review.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  const dialogRef = useDialogAccessibility(open, onCancel)
  if (!open) return null
  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary text-xs">Cancel</button>
          <button onClick={onConfirm} className="btn-primary text-xs">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [reports, setReports] = useState(() => {
    try {
      return loadStoredReports(window.localStorage, initialReports)
    } catch {
      return initialReports
    }
  })

  const [selectedZone, setSelectedZone] = useState(null)
  const [activeView, setActiveView] = useState('overview')
  const [demoRole, setDemoRole] = useState('admin')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [severityFilter, setSeverityFilter] = useState('All priorities')
  const [selectedReport, setSelectedReport] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [category, setCategory] = useState('Road damage')
  const [zoneId, setZoneId] = useState('commercial')
  const [note, setNote] = useState('')
  const [locationNote, setLocationNote] = useState('')
  const [formError, setFormError] = useState('')
  const [imageName, setImageName] = useState('')
  const [fileData, setFileData] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [toast, setToast] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return readThemePreference(window.localStorage, window.matchMedia('(prefers-color-scheme: dark)').matches)
    } catch {
      return false
    }
  })
  const [confirmResolve, setConfirmResolve] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [civicInsights, setCivicInsights] = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState('')

  const fileRef = useRef(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add('dark')
    else root.classList.remove('dark')
    try {
      window.localStorage.setItem('civicsync-theme', darkMode ? 'dark' : 'light')
    } catch {
      // Theme preference remains usable when browser storage is unavailable.
    }
  }, [darkMode])

  useEffect(() => {
    try {
      window.localStorage.setItem('civicsync-reports-v2', JSON.stringify(reports))
    } catch {
      /* Storage may be unavailable or full. */
    }
  }, [reports])

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
  }, [])

  useEffect(() => () => {
    if (fileData) URL.revokeObjectURL(fileData)
  }, [fileData])

  useEffect(() => {
    if (activeView !== 'intelligence' || demoRole !== 'admin') return
    let cancelled = false
    const loadInsights = async () => {
      setInsightsLoading(true)
      setInsightsError('')
      try {
        const response = await fetch('/api/demo/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reports: reports.map(({ id, title, category, zone, zoneId, severity, impact, status, age, createdAt }) => ({ id, title, category, zone, zoneId, severity, impact, status, age, createdAt })) }),
        })
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(payload.error || 'Civic insights could not be generated.')
        if (!payload.insights || !Array.isArray(payload.insights.priorities)) throw new Error('The insights service returned an unexpected response.')
        if (!cancelled) setCivicInsights(payload.insights)
      } catch (error) {
        if (!cancelled) setInsightsError(error.message || 'Civic insights are temporarily unavailable.')
      } finally {
        if (!cancelled) setInsightsLoading(false)
      }
    }
    loadInsights()
    return () => { cancelled = true }
  }, [activeView, demoRole, reports])
  const activeReports = useMemo(() => reports.filter((r) => r.status !== 'Resolved'), [reports])
  const resolvedReports = useMemo(() => reports.filter((r) => r.status === 'Resolved'), [reports])
  const criticalReports = useMemo(() => activeReports.filter((r) => r.severity >= 85), [activeReports])
  const departmentSummary = useMemo(() => {
    const totals = reports.reduce((acc, report) => {
      const key = report.unit || 'Unassigned'
      acc[key] = acc[key] || { department: key, total: 0, open: 0, resolved: 0 }
      acc[key].total += 1
      if (report.status === 'Resolved') acc[key].resolved += 1
      else acc[key].open += 1
      return acc
    }, {})
    return Object.values(totals).sort((a, b) => b.total - a.total)
  }, [reports])
  const categorySummary = useMemo(() => {
    const totals = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1
      return acc
    }, {})
    return Object.entries(totals).map(([name, value]) => ({ name, value }))
  }, [reports])
  const statusSummary = useMemo(() => [
    { name: 'Pending', value: reports.filter((r) => r.status === 'Pending').length },
    { name: 'Assigned', value: reports.filter((r) => r.status === 'Assigned').length },
    { name: 'Dispatched', value: reports.filter((r) => r.status === 'Dispatched').length },
    { name: 'In progress', value: reports.filter((r) => r.status === 'In progress').length },
    { name: 'Resolved', value: resolvedReports.length },
  ], [reports, resolvedReports])
  const myReports = useMemo(
    () => reports.filter((report) => report.citizenId === 'demo-citizen').sort((a, b) => new Date(b.createdAt || b.history?.[0]?.at || 0) - new Date(a.createdAt || a.history?.[0]?.at || 0)),
    [reports]
  )

  const filteredReports = useMemo(
    () =>
      activeReports
        .filter(
          (r) =>
            (!selectedZone || r.zoneId === selectedZone) &&
            (statusFilter === 'All statuses' || r.status === statusFilter) &&
            (categoryFilter === 'All categories' || r.category === categoryFilter) &&
            (severityFilter === 'All priorities' ||
              (severityFilter === 'Critical' && r.severity >= 85) ||
              (severityFilter === 'High' && r.severity >= 65 && r.severity < 85) ||
              (severityFilter === 'Standard' && r.severity < 65)) &&
            (r.title + r.zone + r.category + r.id + r.description + r.unit)
              .toLowerCase()
              .includes(search.trim().toLowerCase())
        )
        .sort((a, b) => b.severity - a.severity),
    [activeReports, selectedZone, statusFilter, categoryFilter, severityFilter, search]
  )

  const highZones = zones.filter((z) => z.density >= 80).length
  const totalSaved = 48600 + reports.filter((r) => !initialReports.some((i) => i.id === r.id)).length * 1250

  const notify = useCallback((message) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3200)
  }, [])

  const dispatch = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id && (r.status === 'Pending' || r.status === 'Assigned') ? { ...r, status: 'Dispatched', history: [...(r.history || []), { status: 'Dispatched', note: 'A municipal response crew was assigned in the demo workflow.', at: new Date().toISOString() }] } : r))
    )
    notify(`Crew dispatched for ${id}`)
  }

  const startWork = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id && r.status === 'Dispatched' ? { ...r, status: 'In progress', history: [...(r.history || []), { status: 'In progress', note: 'Department staff started the assigned work.', at: new Date().toISOString() }] } : r))
    )
    notify(`Work started for ${id}`)
  }

  const resolve = (id) => {
    setConfirmResolve(id)
  }

  const confirmResolveAction = () => {
    if (!confirmResolve) return
    setReports((prev) =>
      prev.map((r) =>
        r.id === confirmResolve && (r.status === 'Dispatched' || r.status === 'In progress')
          ? { ...r, status: 'Resolved', resolvedAt: new Date().toISOString(), resolutionNote: 'Marked resolved in the CivicSync demonstration workflow.', history: [...(r.history || []), { status: 'Resolved', note: 'Work marked complete by department staff.', at: new Date().toISOString() }] }
          : r
      )
    )
    notify(`Report ${confirmResolve} marked as resolved`)
    setConfirmResolve(null)
  }

  const resetDemoData = () => {
    setReports(initialReports)
    setSelectedReport(null)
    setSelectedZone(null)
    setSearch('')
    setStatusFilter('All statuses')
    setCategoryFilter('All categories')
    setSeverityFilter('All priorities')
    setConfirmReset(false)
    notify('Demo data restored to the original sample dataset')
  }

  const exportReportsCsv = () => {
    const columns = ['id', 'title', 'category', 'zone', 'severity', 'status', 'impact', 'cost', 'createdAt']
    const safeCell = (value) => {
      const text = String(value ?? '')
      const protectedText = /^[=+@\- \t\r]/.test(text) ? "'" + text : text
      return '"' + protectedText.replace(/"/g, '""') + '"'
    }
    const rows = [columns, ...reports.map((report) => columns.map((key) => report[key] ?? ''))]
    const csv = rows.map((row) => row.map(safeCell).join(',')).join('\\r\\n')
    const blob = new Blob(['\\uFEFF', csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'civicsync-demo-reports.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    notify('Report CSV exported')
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(f.type)) {
      notify('Choose a PNG, JPG or WEBP image')
      e.target.value = ''
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      notify('Image must be 5 MB or smaller')
      e.target.value = ''
      return
    }
    if (fileData) URL.revokeObjectURL(fileData)

    setImageName(f.name)
    setFileData(URL.createObjectURL(f))

    const reader = new FileReader()
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.readAsDataURL(f)
  }

  const clearImage = () => {
    if (fileData) URL.revokeObjectURL(fileData)
    setFileData('')
    setImageDataUrl('')
    setImageName('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const analyze = async (event) => {
    event.preventDefault()
    if (processing) return
    if (note.trim().length < 8) {
      const message = 'Please describe the issue in at least 8 characters.'
      setFormError(message)
      notify(message)
      return
    }
    if (note.trim().length > 600) {
      const message = 'Keep the description under 600 characters.'
      setFormError(message)
      notify(message)
      return
    }
    setFormError('')
    setProcessing(true)
    setResult(null)
    try {
      const response = await fetch('/api/demo/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: note.trim(), category }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error || 'AI triage is unavailable. Configure GEMINI_API_KEY.')
      const triage = payload.triage
      const municipalResponse = await fetch('/api/demo/municipal')
      const municipal = await municipalResponse.json().catch(() => ({}))
      if (!municipalResponse.ok || !Array.isArray(municipal.departments)) throw new Error('Mock municipal adapter is unavailable.')
      const routedDepartment = municipal.departments.find((department) => department.handles.includes(triage.category))?.name || triage.department
      const zone = zones.find((z) => z.id === zoneId)
      const count = reports.filter((r) => r.zoneId === zoneId && r.category === triage.category).length
      const nextId = Math.max(2048, ...reports.map((r) => Number(String(r.id).replace(/\D/g, '')) || 0)) + 1
      const id = `CS-${nextId}`
      const newReport = {
        id,
        citizenId: 'demo-citizen',
        createdAt: new Date().toISOString(),
        title: triage.summary || note.trim().slice(0, 58),
        category: triage.category,
        zone: zone.name,
        zoneId,
        latitude: zone.latitude,
        longitude: zone.longitude,
        severity: triage.severity,
        status: 'Pending',
        history: [{ status: 'Submitted', note: 'Citizen report received and queued for AI triage.', at: new Date().toISOString() }],
        unit: routedDepartment,
        impact: Math.round(zone.population * (triage.severity / 100) * 0.12),
        cost: { 'Road damage': 8600, Waterlogging: 6900, Streetlight: 2400, 'Waste accumulation': 1700 }[triage.category] ?? 2500,
        age: 'Just now',
        description: note.trim(),
        locationNote: locationNote.trim(),
        duplicate: count ? `Potential duplicate cluster: ${count} similar report(s) in this zone` : 'No matching duplicate cluster found',
        imageData: imageDataUrl || null,
        aiSummary: triage.summary,
        confidence: triage.confidence,
        safetyFlags: triage.safety_flags || [],
        requiresHumanReview: true,
        triageProvider: payload.provider || 'Gemini',
        municipalAdapter: municipal.adapter,
      }
      setReports((prev) => [newReport, ...prev])
      setResult(newReport)
      clearImage()
      setNote('')
      setLocationNote('')
      setFormError('')
      notify('AI triage complete · report added to the demonstration queue')
    } catch (error) {
      notify(error.message || 'AI triage failed')
    } finally {
      setProcessing(false)
    }
  }

  const nav = [
    { id: 'overview', label: 'Overview', icon: Layers3 },
    { id: 'reports', label: demoRole === 'staff' ? 'Work queue' : 'Issue reports', icon: MessageSquareText },
    ...(demoRole === 'citizen' ? [{ id: 'my-reports', label: 'My reports', icon: ClipboardList }] : []),
    ...(demoRole === 'admin' ? [
      { id: 'intelligence', label: 'City intelligence', icon: TrendingUp },
      { id: 'optimizer', label: 'Resource optimizer', icon: Wallet },
    ] : []),
  ]

  const allocationTotal = allocationData.reduce((sum, d) => sum + d.optimized, 0)
  const manualTotal = allocationData.reduce((sum, d) => sum + d.traditional, 0)

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-slate-800 transition-colors dark:bg-[#0b1220] dark:text-slate-200">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-slate-950 lg:flex">
        <Brand />
        <div className="mt-10">
          <div className="eyebrow mb-3 px-3">Workspace</div>
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                    activeView === item.id
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                  {activeView === item.id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                </button>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white dark:bg-slate-800">
          <div className="flex items-center gap-2 text-emerald-300">
            <Radio size={15} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Demo environment</span>
          </div>
          <div className="mt-3 font-display text-sm font-bold">DNCC civic services demo</div>
          <p className="mt-1 text-xs leading-5 text-slate-300">Illustrative city data. No live municipal connection.</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" /> Prototype services available
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex h-[72px] items-center justify-between px-4 sm:px-7 lg:px-9">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Brand />
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">City operations center</div>
                <div className="text-xs text-slate-400">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })} · Demo workspace
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setDarkMode((d) => !d)}
                className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span className="hidden items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 sm:inline-flex dark:bg-amber-950/50 dark:text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> DNCC simulation
              </span>
              <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-950" />
              </button>
              <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
              <label className="hidden items-center gap-2 sm:flex">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Demo role</span>
                <select value={demoRole} onChange={(event) => { setDemoRole(event.target.value); if ((event.target.value !== "admin" && (activeView === "optimizer" || activeView === "intelligence")) || (event.target.value !== "citizen" && activeView === "my-reports")) setActiveView("overview") }} className="field w-auto py-2 text-xs" aria-label="Switch simulated demo role">
                  <option value="citizen">Citizen</option>
                  <option value="staff">Department staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </label>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 dark:border-slate-800 lg:hidden">
            {nav.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                    activeView === item.id
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Dhaka North · Civic issue intelligence
              </div>
              <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                {activeView === 'overview' ? 'Executive overview' : activeView === 'reports' ? (demoRole === 'staff' ? 'Department work queue' : 'Citizen issue reports') : activeView === 'my-reports' ? 'My submitted reports' : activeView === 'intelligence' ? 'City intelligence' : 'Budget & resource optimizer'}
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                {activeView === 'overview'
                  ? 'A unified view of urban infrastructure health, service demand and response priorities.'
                  : activeView === 'reports'
                  ? (demoRole === 'staff' ? 'Review assigned civic issues and move work through the department response workflow.' : 'Explore community reports, inspect AI triage and submit a new civic issue.')
                  : activeView === 'my-reports'
                  ? 'Track the status and response history of reports submitted in this browser’s citizen demo session.'
                  : activeView === 'intelligence'
                  ? 'Explore issue patterns and department workload using the prototype’s synthetic demonstration dataset.'
                  : 'Compare allocation strategies and direct maintenance resources where they create the highest impact.'}
              </p>
            </div>
          </div>

          {activeView === 'overview' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Total reports" value={reports.length} detail="All demonstration complaints" icon={Activity} tone="emerald" />
                <MetricCard label="Open reports" value={activeReports.length} detail="Awaiting or receiving action" icon={Clock3} tone="amber" />
                <MetricCard label="Critical open" value={criticalReports.length} detail="Severity score of 85 or higher" icon={AlertTriangle} tone="rose" />
                <MetricCard label="Resolved reports" value={resolvedReports.length} detail="Completed in this demo dataset" icon={CheckCircle2} tone="slate" />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <ZoneMap selected={selectedZone} onSelect={setSelectedZone} reports={reports} onReportSelect={setSelectedReport} />
                </div>
                <div className="panel p-5 lg:col-span-2">
                  <div className="eyebrow">Live triage stream</div>
                  <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">Recent AI assignments</div>
                  <div className="mt-4 space-y-3">
                    {[...activeReports]
                      .sort((a, b) => b.severity - a.severity)
                      .slice(0, 5)
                      .map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedReport(r)}
                          className="flex w-full items-start gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-slate-800 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                        >
                          <span className={`mt-0.5 rounded-lg px-1.5 py-0.5 text-[10px] font-extrabold ${severityTone(r.severity)}`}>
                            {r.severity}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{r.title}</div>
                            <div className="mt-0.5 text-xs text-slate-400">
                              {r.zone} · {r.unit}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <SectionHeading eyebrow="Operations" title="Priority maintenance queue" subtitle="Highest urgency items first." />
                <ReportTable reports={filteredReports.slice(0, 6)} onDispatch={dispatch} onStart={startWork} onResolve={resolve} onSelect={setSelectedReport} canManage={demoRole !== 'citizen'} />
              </div>
            </>
          )}

          {activeView === 'public' && (() => {
            const total = reports.length
            const resolved = reports.filter((r) => r.status === 'Resolved').length
            const open = total - resolved
            const resolutionRate = total ? Math.round((resolved / total) * 100) : 0
            const statusOrder = ['Pending', 'Assigned', 'Dispatched', 'In progress', 'Resolved']
            const statusData = statusOrder.map((status) => ({
              name: status,
              value: reports.filter((r) => r.status === status).length,
            })).filter((item) => item.value > 0)
            const categories = ['Road damage', 'Waterlogging', 'Streetlight', 'Waste accumulation']
            const categoryData = categories.map((category) => ({
              category: category === 'Waste accumulation' ? 'Waste' : category === 'Road damage' ? 'Roads' : category,
              reports: reports.filter((r) => r.category === category).length,
            }))
            const zonesByVolume = zones.map((zone) => ({
              ...zone,
              count: reports.filter((r) => r.zoneId === zone.id).length,
            })).sort((a, b) => b.count - a.count)
            const latest = [...reports].slice(0, 8)
            const palette = ['#d97706', '#0284c7', '#059669', '#7c3aed', '#64748b']
            return (
              <>
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/30">
                  <ShieldCheck size={19} className="mt-0.5 shrink-0 text-sky-700 dark:text-sky-300" />
                  <div>
                    <div className="text-sm font-bold text-sky-900 dark:text-sky-200">Public information · Read-only view</div>
                    <p className="mt-1 text-xs leading-5 text-sky-800 dark:text-sky-300">This dashboard summarizes the prototype's local demonstration records. It is not an official DNCC publication, live service feed or verified performance report.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Reports recorded" value={total} detail="All records in this browser demo" icon={MessageSquareText} tone="emerald" />
                  <MetricCard label="Open issues" value={open} detail="Not yet marked resolved" icon={Clock3} tone="amber" />
                  <MetricCard label="Resolved" value={resolved} detail="Marked complete in the demo" icon={CheckCircle2} tone="slate" />
                  <MetricCard label="Resolution share" value={resolutionRate + '%'} detail="Resolved divided by all recorded reports" icon={TrendingUp} tone="emerald" />
                </div>
                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <div className="panel p-5">
                    <div className="eyebrow">Service demand</div>
                    <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Reports by issue type</h3>
                    <div className="mt-4 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="reports" name="Reports" fill="#059669" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="panel p-5">
                    <div className="eyebrow">Response progress</div>
                    <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Current report statuses</h3>
                    <div className="mt-4 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={92} paddingAngle={3}>
                            {statusData.map((entry, index) => <Cell key={entry.name} fill={palette[index % palette.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                      {statusData.map((entry, index) => <span key={entry.name} className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400"><i className="h-2 w-2 rounded-full" style={{ background: palette[index % palette.length] }} />{entry.name} · {entry.value}</span>)}
                    </div>
                  </div>
                </div>
                <section className="mt-6 space-y-5">
                <div className="panel p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="eyebrow flex items-center gap-2"><Sparkles size={13} /> Rule-based civic insights</div>
                      <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">What needs attention?</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Analysis of the current browser-local demonstration reports.</p>
                    </div>
                    <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Auto-updates with report changes</span>
                  </div>
                  {insightsLoading && !civicInsights && <p className="mt-4 text-sm text-slate-500">Analyzing the current report snapshot…</p>}
                  {insightsError && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">{insightsError} The existing dashboard metrics remain available.</div>}
                  {civicInsights && (
                    <>
                      <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">{civicInsights.summary}</p>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                          <div className="eyebrow">Most common open categories</div>
                          <div className="mt-3 space-y-2">
                            {civicInsights.patterns.categories.slice(0, 4).map((item) => <div key={item.name} className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-600 dark:text-slate-300">{item.name}</span><strong className="text-slate-900 dark:text-white">{item.count}</strong></div>)}
                            {civicInsights.patterns.categories.length === 0 && <p className="text-xs text-slate-400">No open category patterns.</p>}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                          <div className="eyebrow">Zones with most open reports</div>
                          <div className="mt-3 space-y-2">
                            {civicInsights.patterns.zones.slice(0, 4).map((item) => <div key={item.name} className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-600 dark:text-slate-300">{item.name}</span><strong className="text-slate-900 dark:text-white">{item.count}</strong></div>)}
                            {civicInsights.patterns.zones.length === 0 && <p className="text-xs text-slate-400">No open zone patterns.</p>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5">
                        <div className="eyebrow">Recommended review order</div>
                        <div className="mt-3 space-y-2">
                          {civicInsights.priorities.map((item, index) => (
                            <button type="button" key={item.id} onClick={() => { const report = reports.find((entry) => entry.id === item.id); if (report) setSelectedReport(report) }} className="flex w-full flex-col gap-2 rounded-xl border border-slate-100 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40 sm:flex-row sm:items-center dark:border-slate-800 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{index + 1}</span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">{item.title}</span>
                                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{item.category} · {item.zone} · {item.status}</span>
                                <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{item.reasons.join(' · ')}</span>
                              </span>
                              <span className={'shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-extrabold ' + severityTone(item.priorityScore)}>Score {item.priorityScore}</span>
                            </button>
                          ))}
                          {civicInsights.priorities.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">No open reports currently need prioritization.</p>}
                        </div>
                      </div>
                      <p className="mt-4 text-[11px] leading-5 text-slate-400">Scoring: 60% severity, 25% relative estimated impact, 15% report age (maximum 72 hours). Generated {new Date(civicInsights.generatedAt).toLocaleString()}.</p>
                    </>
                  )}
                </div>
              </section>
              <section className="mt-6 panel p-5" aria-labelledby="demo-controls-title">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="eyebrow">Presentation utilities</div>
                    <h3 id="demo-controls-title" className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Demo data controls</h3>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                      Export the current browser-local report snapshot or restore the original synthetic sample dataset.
                    </p>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{reports.length} reports currently in this browser · Changes do not affect other users or devices.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={exportReportsCsv} className="btn-secondary text-xs">
                      <Download size={14} /> Export CSV
                    </button>
                    <button onClick={() => setConfirmReset(true)} className="btn-secondary text-xs">
                      <RotateCcw size={14} /> Reset sample data
                    </button>
                  </div>
                </div>
              </section>
              <div className="mt-6 grid gap-6 xl:grid-cols-5">
                  <div className="panel p-5 xl:col-span-2">
                    <div className="eyebrow">Area overview</div>
                    <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Reports by demo zone</h3>
                    <div className="mt-5 space-y-4">
                      {zonesByVolume.map((zone) => <div key={zone.id}>
                        <div className="mb-1.5 flex justify-between gap-3 text-xs"><span className="font-semibold text-slate-700 dark:text-slate-200">{zone.name}</span><span className="font-bold tabular-nums text-slate-500">{zone.count}</span></div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-emerald-600" style={{ width: (total ? zone.count / Math.max(...zonesByVolume.map((item) => item.count), 1) * 100 : 0) + '%' }} /></div>
                      </div>)}
                    </div>
                  </div>
                  <div className="panel p-5 xl:col-span-3">
                    <div className="eyebrow">Community updates</div>
                    <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Recent reported issues</h3>
                    <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                      {latest.map((report) => <button key={report.id} onClick={() => setSelectedReport(report)} className="flex w-full items-center justify-between gap-3 py-3 text-left first:pt-0 last:pb-0">
                        <div className="min-w-0"><div className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{report.title}</div><div className="mt-1 text-xs text-slate-400">{report.zone} · {report.id}</div></div>
                        <span className={'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ' + (statusStyles[report.status] || statusStyles.Pending)}>{report.status}</span>
                      </button>)}
                    </div>
                  </div>
                </div>
              </>
            )
          })()}

          {activeView === 'reports' && (
            <>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search reports, zones, units..."
                    className="field pl-10"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field w-auto min-w-[140px]">
                  <option>All statuses</option>
                  <option>Pending</option>
                  <option>Assigned</option>
                  <option>Dispatched</option>
                  <option>In progress</option>
                </select>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="field w-auto min-w-[155px]">
                  <option>All categories</option>
                  <option>Road damage</option>
                  <option>Waterlogging</option>
                  <option>Streetlight</option>
                  <option>Waste accumulation</option>
                </select>
                <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="field w-auto min-w-[145px]">
                  <option>All priorities</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Standard</option>
                </select>
              </div>

              <div className="grid gap-6 xl:grid-cols-5">
                <div className="order-2 xl:order-1 xl:col-span-3">
                  <ReportTable reports={filteredReports} onDispatch={dispatch} onStart={startWork} onResolve={resolve} onSelect={setSelectedReport} canManage={demoRole !== 'citizen'} />
                </div>

                <div className="panel order-1 p-5 sm:p-6 xl:order-2 xl:col-span-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="eyebrow">Citizen report simulator</div>
                      <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Submit a civic issue</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Share what happened and where. AI triage will create a demonstration report.</p>
                    </div>
                    <span className="hidden shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 sm:inline-flex">STEP 1 · REPORT</span>
                  </div>

                  <form onSubmit={analyze} className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="report-category" className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">Issue category</label>
                      <select id="report-category" value={category} onChange={(e) => setCategory(e.target.value)} className="field min-h-12">
                        <option>Road damage</option>
                        <option>Waterlogging</option>
                        <option>Streetlight</option>
                        <option>Waste accumulation</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="report-zone" className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">Area / zone</label>
                      <select id="report-zone" value={zoneId} onChange={(e) => setZoneId(e.target.value)} className="field min-h-12">
                        {zones.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="report-location" className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300"><MapPin size={13} /> Nearby street / landmark <span className="font-normal text-slate-400">(optional)</span></label>
                      <input id="report-location" value={locationNote} onChange={(e) => setLocationNote(e.target.value)} maxLength={100} placeholder="e.g. Beside the main gate, Road 12" className="field min-h-12" />
                      <p className="mt-1 text-[10px] text-slate-400">A useful landmark helps distinguish the exact spot within the selected zone.</p>
                    </div>
                    <div>
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <label htmlFor="report-description" className="block text-xs font-bold text-slate-600 dark:text-slate-300">What happened?</label>
                        <span className={`text-[10px] font-semibold tabular-nums ${note.length > 560 ? 'text-amber-600' : 'text-slate-400'}`}>{note.length}/600</span>
                      </div>
                      <textarea
                        id="report-description"
                        value={note}
                        onChange={(e) => { setNote(e.target.value); if (e.target.value.trim().length >= 8) setFormError('') }}
                        rows={4}
                        maxLength={600}
                        required
                        placeholder="Describe what you noticed, how long it has been happening, and who may be affected."
                        className={`field resize-y ${formError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
                        aria-describedby={formError ? 'report-description-error' : 'report-description-help'}
                      />
                      {formError ? <p id="report-description-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{formError}</p> : <p id="report-description-help" className="mt-1.5 text-[10px] text-slate-400">Use at least 8 characters. Avoid sharing personal or sensitive information.</p>}
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <label htmlFor="report-image" className="block text-xs font-bold text-slate-600 dark:text-slate-300">Photo evidence <span className="font-normal text-slate-400">(optional)</span></label>
                        {fileData && <button type="button" onClick={clearImage} className="text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400">Remove photo</button>}
                      </div>
                      <input ref={fileRef} id="report-image" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleFileChange} />
                      <label htmlFor="report-image" className="flex min-h-[116px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-3 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/20">
                        {fileData ? <img src={fileData} alt="Preview of selected issue evidence" className="max-h-40 w-full rounded-xl object-cover" /> : <><CloudUpload size={25} className="text-slate-400" /><span className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">Add a photo of the issue</span><span className="mt-1 text-xs text-slate-400">PNG, JPG or WEBP · up to 5 MB</span></>}
                      </label>
                      <p className="mt-1.5 text-[10px] text-slate-400">The image stays in this browser’s local demo storage.</p>
                    </div>

                    <button type="submit" disabled={processing} className="btn-primary min-h-12 w-full text-sm">
                      {processing ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Running AI triage…
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} /> Run AI triage
                        </>
                      )}
                    </button>
                  </form>

                  {result && (
                    <div className="mt-5 animate-slide-up rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30" role="status" aria-live="polite">
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 size={17} /> Report created successfully
                      </div>
                      <p className="mt-1 text-sm text-emerald-900 dark:text-emerald-200">Reference <strong>{result.id}</strong> · Priority {result.severity}/100</p>
                      <p className="mt-1 text-xs leading-5 text-emerald-800 dark:text-emerald-300">Your report has been added to the local demonstration queue and can be opened for its response timeline.</p>
                      <button type="button" onClick={() => { setSelectedReport(result); setResult(null) }} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/50">View report details <ArrowUpRight size={14} /></button>
                    </div>
                  )}

                  <div className="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <ShieldCheck size={14} className="text-emerald-700 dark:text-emerald-400" /> Privacy-first prototype
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Images are previewed and optionally stored as data URLs in localStorage for this demo only. Nothing is uploaded to a server.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}


          {activeView === 'my-reports' && demoRole === 'citizen' && (
            <section aria-labelledby="my-reports-heading">
              <div className="mb-5 grid gap-4 sm:grid-cols-3">
                <div className="panel p-4">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total submitted</div>
                  <div className="mt-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">{myReports.length}</div>
                </div>
                <div className="panel p-4">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Awaiting action</div>
                  <div className="mt-2 font-display text-2xl font-extrabold text-amber-600">{myReports.filter((report) => report.status !== 'Resolved').length}</div>
                </div>
                <div className="panel p-4">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resolved</div>
                  <div className="mt-2 font-display text-2xl font-extrabold text-emerald-600">{myReports.filter((report) => report.status === 'Resolved').length}</div>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id="my-reports-heading" className="font-display text-lg font-extrabold text-slate-900 dark:text-white">Your report activity</h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Updates are stored in this browser for the demonstration.</p>
                </div>
                <button onClick={() => setActiveView('reports')} className="btn-primary">
                  <Plus size={15} /> Submit another issue
                </button>
              </div>

              {myReports.length === 0 ? (
                <div className="panel flex flex-col items-center px-6 py-14 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <ClipboardList size={25} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-extrabold text-slate-900 dark:text-white">No reports submitted yet</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">When you submit an issue through the citizen demo, it will appear here with its reference number, current status and response timeline.</p>
                  <button onClick={() => setActiveView('reports')} className="btn-primary mt-5">
                    <Plus size={15} /> Report a civic issue
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReports.map((report) => (
                    <article key={report.id} className="panel p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-extrabold tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">{report.id}</span>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyles[report.status] || statusStyles.Pending}`}>{report.status}</span>
                          </div>
                          <h3 className="mt-3 font-display text-base font-extrabold text-slate-900 dark:text-white">{report.title}</h3>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{report.category} · {report.zone} · Submitted {new Date(report.createdAt || report.history?.[0]?.at || Date.now()).toLocaleString()}</p>
                        </div>
                        <button onClick={() => setSelectedReport(report)} className="btn-secondary shrink-0 text-xs">View details <ArrowUpRight size={14} /></button>
                      </div>

                      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Response timeline</div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {(report.history?.length ? report.history : [{ status: 'Submitted', note: 'Report received.' }]).map((entry, index) => (
                            <div key={entry.status + index} className="flex gap-2.5">
                              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${index === (report.history?.length || 1) - 1 ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950' : 'bg-slate-300 dark:bg-slate-600'}`} />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{entry.status}</div>
                                <p className="mt-0.5 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{entry.note}</p>
                                {entry.at && <p className="mt-1 text-[10px] text-slate-400">{new Date(entry.at).toLocaleString()}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                <strong>Demo privacy note:</strong> This is a browser-local citizen profile, not a verified account. Reports are not synced across devices or shared with DNCC.
              </div>
            </section>
          )}

          {activeView === 'intelligence' && demoRole === 'admin' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Departments represented" value={departmentSummary.length} detail="Across the demo service model" icon={Building2} tone="emerald" />
                <MetricCard label="Resolution rate" value={reports.length ? Math.round((resolvedReports.length / reports.length) * 100) + '%' : '0%'} detail="Resolved ÷ all seeded and submitted reports" icon={CheckCircle2} tone="slate" />
                <MetricCard label="Critical backlog" value={criticalReports.length} detail="Open reports needing priority review" icon={AlertTriangle} tone="rose" />
                <MetricCard label="Issue categories" value={categorySummary.length} detail="Supported civic issue types" icon={Filter} tone="amber" />
              </div>
              <div className="mt-6 grid gap-6 xl:grid-cols-5">
                <div className="panel p-5 xl:col-span-3">
                  <div className="eyebrow">Department workload</div>
                  <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Reports by responsible unit</h3>
                  <div className="mt-5 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentSummary} layout="vertical" margin={{ top: 4, right: 18, left: 18, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="department" width={125} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="open" name="Open" stackId="reports" fill="#0d9488" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="resolved" name="Resolved" stackId="reports" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="panel p-5 xl:col-span-2">
                  <div className="eyebrow">Service status</div>
                  <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Complaint lifecycle</h3>
                  <div className="mt-5 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusSummary} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
                          {statusSummary.map((entry, index) => <Cell key={entry.name} fill={['#f59e0b', '#64748b', '#0ea5e9', '#8b5cf6', '#10b981'][index]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {statusSummary.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">{entry.name}</span>
                        <strong className="text-slate-800 dark:text-slate-100">{entry.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {departmentSummary.map((department) => (
                  <div key={department.department} className="panel p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{department.department}</div>
                        <div className="mt-1 text-xs text-slate-400">{department.total} reports in the demonstration dataset</div>
                      </div>
                      <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">{department.resolved} resolved</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: (department.total ? department.resolved / department.total * 100 : 0) + '%' }} />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>{department.open} open</span><span>{department.total ? Math.round(department.resolved / department.total * 100) : 0}% resolved</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                <strong>Data transparency:</strong> All figures are calculated from local demonstration records. They are not live DNCC statistics, verified service-level results or official departmental performance data.
              </div>
            </>
          )}

          {activeView === 'optimizer' && (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="panel p-5">
                  <div className="eyebrow">Budget allocation</div>
                  <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">Traditional vs optimized</h3>
                  <div className="mt-5 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={allocationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                            background: darkMode ? '#1e293b' : '#fff',
                            color: darkMode ? '#e2e8f0' : '#0f172a',
                          }}
                        />
                        <Bar dataKey="traditional" name="Traditional" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="optimized" name="Optimized" fill="#059669" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Total traditional: {manualTotal} units</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Optimized: {allocationTotal} units</span>
                  </div>
                </div>

                <div className="panel p-5">
                  <div className="eyebrow">Decision factors</div>
                  <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">What drives priority?</h3>
                  <div className="mt-5 space-y-5">
                    {[
                      { label: 'Public safety & severity', value: 35, color: '#b45309' },
                      { label: 'Population affected', value: 25, color: '#047857' },
                      { label: 'Service disruption', value: 25, color: '#64748b' },
                      { label: 'Issue duration', value: 15, color: '#0e7490' },
                    ].map((x) => (
                      <div key={x.label}>
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{x.label}</span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-100">{x.value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: x.value + '%', background: x.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <AlertTriangle size={14} /> Decision support, not autopilot
                    </div>
                    <p className="mt-1 text-xs leading-5 text-amber-900 dark:text-amber-200">
                      Recommendations are illustrative and require review by municipal finance and operations teams.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <SectionHeading eyebrow="Recommended action plan" title="Ranked maintenance projects" subtitle="Dispatch teams to the highest-urgency work first." />
                <ReportTable
                  reports={[...activeReports].sort((a, b) => b.severity - a.severity)}
                  onDispatch={dispatch}
                  onStart={startWork}
                  onResolve={resolve}
                  onSelect={setSelectedReport}
                  canManage={demoRole !== 'citizen'}
                />
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-200">Method note:</span> Allocation figures and savings are synthetic demonstration values, not audited financial outcomes or live city budget data. The prototype illustrates a prioritization workflow.
              </div>
            </>
          )}

          <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-[11px] text-slate-400 dark:border-slate-800 sm:flex-row">
            <span>© 2026 CivicSync AI · DNCC hackathon prototype · Enhanced by Jixsaw</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} /> Synthetic demo data · No live government integration
            </span>
          </footer>
        </div>
      </main>

      <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      <ConfirmDialog
        open={confirmReset}
        title="Restore the sample dataset?"
        message="This replaces all report changes and citizen-submitted demo reports in this browser with the original synthetic sample records. This cannot be undone."
        confirmLabel="Restore sample data"
        onConfirm={resetDemoData}
        onCancel={() => setConfirmReset(false)}
      />
      <ConfirmDialog
        open={!!confirmResolve}
        title="Mark as resolved?"
        message={`Confirm that the issue for ${confirmResolve} has been fully addressed by the dispatched crew.`}
        confirmLabel="Yes, resolve"
        onConfirm={confirmResolveAction}
        onCancel={() => setConfirmResolve(null)}
      />

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] flex animate-slide-up items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl dark:bg-emerald-900">
          <Check size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
