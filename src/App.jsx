import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Building2,
  Check, CheckCircle2, ChevronDown, Clock3, CloudUpload, FileImage, Filter,
  Gauge, Layers3, Leaf, MapPin, Menu, MessageSquareText, Navigation,
  Plus, Radio, Search, ShieldCheck, Sparkles, TrendingUp, Users, Wallet,
  X, Zap,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { allocationData, departmentFor, initialReports, severityFor, zones } from './data'

const money = (value) => '$' + Number(value).toLocaleString('en-US')
const statusStyles = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Assigned: 'bg-sky-50 text-sky-700 ring-sky-200',
  Dispatched: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'In progress': 'bg-violet-50 text-violet-700 ring-violet-200',
  Resolved: 'bg-slate-100 text-slate-600 ring-slate-200',
}
const severityTone = (score) => score >= 85 ? 'text-rose-700 bg-rose-50' : score >= 65 ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'

function Brand() {
  return <div className="flex items-center gap-3">
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-800 text-white shadow-sm"><Activity size={21} /></div>
    <div><div className="font-display text-[17px] font-extrabold tracking-tight text-slate-900">CivicPulse <span className="text-emerald-700">AI</span></div><div className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Urban intelligence</div></div>
  </div>
}

function MetricCard({ label, value, detail, icon: Icon, trend, tone = 'emerald' }) {
  const tones = { emerald: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', rose: 'bg-rose-50 text-rose-700', slate: 'bg-slate-100 text-slate-700' }
  return <div className="panel p-5">
    <div className="flex items-start justify-between"><span className="text-sm font-medium text-slate-500">{label}</span><span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}><Icon size={19}/></span></div>
    <div className="mt-4 flex items-end justify-between gap-2"><div className="font-display text-[30px] font-extrabold tracking-tight text-slate-900">{value}</div>{trend && <span className="mb-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-700"><ArrowDownRight size={14}/>{trend}</span>}</div>
    <p className="mt-1 text-xs text-slate-400">{detail}</p>
  </div>
}

function SectionHeading({ eyebrow, title, subtitle, action }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><div className="eyebrow">{eyebrow}</div><h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{action}</div>
}

function ZoneMap({ selected, onSelect, reports }) {
  const counts = zones.map((z) => ({ ...z, live: reports.filter((r) => r.zoneId === z.id && r.status !== 'Resolved').length }))
  const colors = (density) => density >= 80 ? 'border-rose-200 bg-rose-100 text-rose-900 hover:bg-rose-200' : density >= 55 ? 'border-amber-200 bg-amber-100 text-amber-900 hover:bg-amber-200' : 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
  return <div className="panel p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><div className="eyebrow">Live issue density</div><div className="mt-1 text-sm font-bold text-slate-800">City zone intelligence map</div></div><div className="flex gap-3 text-[11px] font-medium text-slate-500"><span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-emerald-300"/>Low</span><span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-amber-300"/>Medium</span><span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-rose-300"/>High</span></div></div>
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-[#f4f7f5] p-3">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{backgroundImage:'linear-gradient(rgba(148,163,184,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(148,163,184,.18) 1px, transparent 1px)',backgroundSize:'30px 30px'}}/>
      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4">
        {counts.map((zone) => <button key={zone.id} onClick={() => onSelect(selected === zone.id ? null : zone.id)} className={`group min-h-[104px] rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${colors(zone.density)} ${selected === zone.id ? 'ring-2 ring-emerald-700 ring-offset-2' : ''}`}>
          <div className="flex items-center justify-between"><span className="text-[10px] font-extrabold tracking-widest opacity-60">{zone.short}</span><MapPin size={13} className="opacity-60"/></div>
          <div className="mt-3 text-xs font-bold leading-tight">{zone.name}</div>
          <div className="mt-1 flex items-center justify-between"><span className="text-[10px] opacity-70">{zone.live} active</span><span className="text-sm font-extrabold">{zone.density}%</span></div>
        </button>)}
      </div>
      <div className="relative mt-3 flex items-center justify-between border-t border-slate-200/80 pt-3 text-[10px] text-slate-400"><span className="flex items-center gap-1"><Navigation size={12}/> Schematic city zones · illustrative, not to scale</span><span>Click a zone to filter reports</span></div>
    </div>
    {selected && <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 text-sm"><span className="font-semibold text-emerald-900">{zones.find(z=>z.id===selected)?.name} selected</span><button onClick={()=>onSelect(null)} className="text-xs font-bold text-emerald-800 underline">Clear filter</button></div>}
  </div>
}

function ReportTable({ reports, onDispatch, onResolve, onSelect }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><div className="font-display font-extrabold text-slate-900">Priority maintenance queue</div><div className="mt-0.5 text-xs text-slate-400">Ranked by urgency and estimated public impact</div></div><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{reports.length} tickets</span></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Issue / Zone</th><th className="px-4 py-3">Urgency</th><th className="px-4 py-3">People impacted</th><th className="px-4 py-3">Est. cost</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">
      {reports.map((r) => <tr key={r.id} className="transition hover:bg-slate-50/80"><td className="px-5 py-4"><button onClick={()=>onSelect(r)} className="text-left"><div className="font-bold text-slate-800 hover:text-emerald-800">{r.title}</div><div className="mt-1 text-xs text-slate-400">{r.zone} · {r.id}</div></button></td><td className="px-4 py-4"><span className={`rounded-lg px-2 py-1 text-xs font-extrabold ${severityTone(r.severity)}`}>{r.severity}/100</span></td><td className="px-4 py-4 font-semibold text-slate-600">{r.impact.toLocaleString()}</td><td className="px-4 py-4 font-semibold text-slate-600">{money(r.cost)}</td><td className="px-4 py-4"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyles[r.status] || statusStyles.Pending}`}>{r.status}</span></td><td className="px-5 py-4 text-right">{r.status === 'Pending' || r.status === 'Assigned' ? <button onClick={()=>onDispatch(r.id)} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800">Dispatch crew</button> : r.status === 'Dispatched' || r.status === 'In progress' ? <button onClick={()=>onResolve(r.id)} className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50">Resolve</button> : <span className="text-xs font-medium text-slate-400">Completed</span>}</td></tr>)}
      {reports.length === 0 && <tr><td colSpan="6" className="px-5 py-10 text-center text-sm text-slate-400">No reports in this zone yet.</td></tr>}
    </tbody></table></div>
  </div>
}

function ReportModal({ report, onClose }) {
  if (!report) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={onClose}><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between"><div><div className="eyebrow">Report details · {report.id}</div><h3 className="mt-1 font-display text-xl font-extrabold text-slate-900">{report.title}</h3></div><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18}/></button></div><p className="mt-4 text-sm leading-6 text-slate-600">{report.description}</p><div className="mt-5 grid grid-cols-2 gap-3">{[['Category',report.category],['Zone',report.zone],['Assigned unit',report.unit],['Est. repair',money(report.cost)]].map(([k,v])=><div key={k} className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</div><div className="mt-1 text-sm font-bold text-slate-800">{v}</div></div>)}</div><div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3"><div className="flex items-center gap-2 text-xs font-bold text-emerald-800"><Sparkles size={14}/> AI triage insight</div><p className="mt-1 text-sm text-emerald-900">Severity score {report.severity}/100 · {report.duplicate}</p></div></div></div>
}

function App() {
  const [reports, setReports] = useState(() => {\n    try {\n      const saved = window.localStorage.getItem('civicpulse-reports-v1')\n      if (!saved) return initialReports\n      const parsed = JSON.parse(saved)\n      return Array.isArray(parsed) && parsed.every(r => r && typeof r.id === 'string' && typeof r.status === 'string') ? parsed : initialReports\n    } catch { return initialReports }\n  })
  const [selectedZone, setSelectedZone] = useState(null)
  const [activeView, setActiveView] = useState('overview')
  const [search, setSearch] = useState('')\n  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [showReport, setShowReport] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [category, setCategory] = useState('Road damage')
  const [zoneId, setZoneId] = useState('commercial')
  const [note, setNote] = useState('')
  const [imageName, setImageName] = useState('')
  const [fileData, setFileData] = useState('')
  const [toast, setToast] = useState('')
  const fileRef = useRef(null)\n  const toastTimer = useRef(null)\n\n  useEffect(() => {\n    try { window.localStorage.setItem('civicpulse-reports-v1', JSON.stringify(reports)) } catch { /* Storage may be unavailable or full. */ }\n  }, [reports])\n\n  useEffect(() => () => {\n    if (toastTimer.current) window.clearTimeout(toastTimer.current)\n  }, [])\n\n  useEffect(() => () => {\n    if (fileData) URL.revokeObjectURL(fileData)\n  }, [fileData])

  const activeReports = reports.filter(r => r.status !== 'Resolved')
  const filteredReports = useMemo(() => activeReports.filter(r => (!selectedZone || r.zoneId === selectedZone) && (r.title + r.zone + r.category + r.id).toLowerCase().includes(search.toLowerCase())).sort((a,b)=>b.severity-a.severity), [activeReports, selectedZone, search])
  const highZones = zones.filter(z => z.density >= 80).length
  const totalSaved = 48600 + reports.filter(r=>!initialReports.some(i=>i.id===r.id)).length * 1250

  const notify = (message) => {\n    setToast(message)\n    if (toastTimer.current) window.clearTimeout(toastTimer.current)\n    toastTimer.current = window.setTimeout(() => setToast(''), 2800)\n  }
  const dispatch = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Dispatched' } : r))
    notify(`Crew dispatched for ${id}`)
  }
  const analyze = async (event) => {
    event.preventDefault()
    if (processing) return
    setProcessing(true)
    setResult(null)
    await new Promise(resolve => window.setTimeout(resolve, 1500))
    const zone = zones.find(z=>z.id===zoneId)
    const severity = severityFor(category, note)
    const count = reports.filter(r=>r.zoneId===zoneId && r.category===category).length
    const nextId = Math.max(2049, ...reports.map(r => Number(String(r.id).replace(/\\D/g, '')) || 0)) + 1\n    const id = `CP-${nextId}`
    const newReport = {
      id, title: note.trim() ? note.trim().slice(0, 58) : category + ' reported near ' + zone.name,
      category, zone: zone.name, zoneId, severity, status: 'Pending',
      unit: departmentFor(category), impact: Math.round(zone.population * (severity / 100) * 0.12),
      cost: ({'Road damage': 8600, Waterlogging: 6900, Streetlight: 2400, 'Waste accumulation': 1700})[category] ?? 2500,
      age: 'Just now', description: note || 'Citizen-submitted infrastructure report.', duplicate: count ? `Potential duplicate cluster: ${count} similar report(s) in this zone` : 'No matching duplicate cluster found',
    }
    setReports(prev=>[newReport,...prev])
    setResult(newReport)
    setProcessing(false)
    notify('AI triage complete · report added to live queue')
  }
  const nav = [
    {id:'overview', label:'Overview', icon:Layers3},
    {id:'reports', label:'Issue reports', icon:MessageSquareText},
    {id:'optimizer', label:'Resource optimizer', icon:Wallet},
  ]
  const allocationTotal = allocationData.reduce((sum,d)=>sum+d.optimized,0)
  const manualTotal = allocationData.reduce((sum,d)=>sum+d.traditional,0)

  return <div className="min-h-screen bg-[#f5f7f6] text-slate-800">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
      <Brand/>
      <div className="mt-10"><div className="eyebrow mb-3 px-3">Workspace</div><nav className="space-y-1">{nav.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>setActiveView(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeView===item.id?'bg-emerald-50 text-emerald-800':'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}><Icon size={18}/>{item.label}{activeView===item.id&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600"/>}</button>})}</nav></div>
      <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white"><div className="flex items-center gap-2 text-emerald-300"><Radio size={15}/><span className="text-[10px] font-bold uppercase tracking-widest">Demo environment</span></div><div className="mt-3 font-display text-sm font-bold">Smart Nation pilot</div><p className="mt-1 text-xs leading-5 text-slate-300">Illustrative city data. No live municipal connection.</p><div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-400"/> All systems operational</div></div>
    </aside>

    <main className="min-h-screen lg:pl-[248px]">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"><div className="flex h-[72px] items-center justify-between px-4 sm:px-7 lg:px-9"><div className="flex items-center gap-3"><div className="lg:hidden"><Brand/></div><div className="hidden lg:block"><div className="text-sm font-bold text-slate-800">City operations center</div><div className="text-xs text-slate-400">{new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})} · Demo workspace</div></div></div><div className="flex items-center gap-2 sm:gap-4"><span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600"/> Prototype live</span><button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><Bell size={19}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white"/></button><div className="hidden h-8 w-px bg-slate-200 sm:block"/><div className="hidden items-center gap-2 sm:flex"><div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800">AD</div><div><div className="text-xs font-bold text-slate-800">Admin Demo</div><div className="text-[10px] text-slate-400">Municipal authority</div></div><ChevronDown size={14} className="text-slate-400"/></div></div></div>
        <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">{nav.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>setActiveView(item.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${activeView===item.id?'bg-emerald-50 text-emerald-800':'text-slate-500'}`}><Icon size={15}/>{item.label}</button>})}</div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600"/> Smart Nation · Integrated public-data intelligence</div><h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{activeView==='overview'?'Executive overview':activeView==='reports'?'Citizen issue reports':'Budget & resource optimizer'}</h1><p className="mt-1.5 max-w-2xl text-sm text-slate-500">{activeView==='overview'?'A unified view of urban infrastructure health, service demand and response priorities.':activeView==='reports'?'Review citizen-submitted reports, inspect AI triage and dispatch municipal crews.':'Compare allocation strategies and direct maintenance capacity toward the highest-impact needs.'}</p></div><button onClick={()=>setActiveView('reports')} className="btn-primary"><Plus size={17}/> New citizen report</button></div>

        {activeView==='overview' && <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Active reports" value={activeReports.length.toLocaleString()} detail="Across 8 city zones" icon={MessageSquareText} trend="12% this week"/>
            <MetricCard label="High-severity zones" value={highZones} detail="Zones with issue density ≥ 80%" icon={AlertTriangle} tone="rose"/>
            <MetricCard label="Estimated budget saved" value={money(totalSaved)} detail="Illustrative AI prioritization estimate" icon={Wallet} trend="8.4% efficiency" />
            <MetricCard label="Average dispatch time" value="2.4 hrs" detail="Target: under 3 hours" icon={Clock3} tone="amber"/>
          </div>
          <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.85fr]"><ZoneMap selected={selectedZone} onSelect={setSelectedZone} reports={reports}/><div className="panel p-5"><div className="eyebrow">Service performance</div><div className="mt-1 font-display text-base font-extrabold text-slate-900">Weekly response trend</div><div className="mt-5 h-[205px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{day:'Mon',resolved:18,received:25},{day:'Tue',resolved:22,received:31},{day:'Wed',resolved:19,received:28},{day:'Thu',resolved:29,received:35},{day:'Fri',resolved:32,received:38},{day:'Sat',resolved:26,received:30},{day:'Sun',resolved:35,received:39}]}><defs><linearGradient id="resolvedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#059669" stopOpacity={.2}/><stop offset="100%" stopColor="#059669" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#eef2f0" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#94a3b8'}}/><YAxis hide/><Tooltip contentStyle={{borderRadius:12,border:'1px solid #e2e8f0',fontSize:12}}/><Area type="monotone" dataKey="received" name="Received" stroke="#c28b36" strokeWidth={2} fill="transparent"/><Area type="monotone" dataKey="resolved" name="Resolved" stroke="#059669" strokeWidth={2.5} fill="url(#resolvedFill)"/></AreaChart></ResponsiveContainer></div><div className="mt-3 flex gap-4 text-xs text-slate-500"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-600"/> Resolved</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-600"/> Received</span></div></div></div>
          <div className="mt-6"><SectionHeading eyebrow="Action required" title="Highest-priority maintenance" subtitle="The most urgent active reports across the city." action={<button onClick={()=>setActiveView('reports')} className="btn-secondary">View all reports <ArrowUpRight size={15}/></button>}/><ReportTable reports={filteredReports.slice(0,5)} onDispatch={dispatch} onResolve={resolve} onSelect={setSelectedReport}/></div>
        </>}

        {activeView==='reports' && <>
          <div className="grid gap-4 sm:grid-cols-3"><MetricCard label="Open reports" value={activeReports.length} detail="Awaiting or receiving action" icon={MessageSquareText}/><MetricCard label="Critical & high" value={activeReports.filter(r=>r.severity>=80).length} detail="Severity score of 80 or above" icon={AlertTriangle} tone="rose"/><MetricCard label="Resolved reports" value={reports.filter(r=>r.status==='Resolved').length} detail="Closed in this demo dataset" icon={CheckCircle2} tone="slate"/></div>
          <div className="mt-6 panel p-5"><SectionHeading eyebrow="Citizen engagement" title="Report an infrastructure issue" subtitle="Submit a sample report and watch the AI triage workflow run locally." action={<span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800">AI simulator ready</span>}/>
            <form onSubmit={analyze} className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
              <div className="space-y-4"><div><label className="mb-1.5 block text-xs font-bold text-slate-600">Issue category</label><select className="field" value={category} onChange={e=>setCategory(e.target.value)}><option>Road damage</option><option>Waterlogging</option><option>Streetlight</option><option>Waste accumulation</option></select></div><div><label className="mb-1.5 block text-xs font-bold text-slate-600">City zone</label><select className="field" value={zoneId} onChange={e=>setZoneId(e.target.value)}>{zones.map(z=><option key={z.id} value={z.id}>{z.name}</option>)}</select></div><div><label className="mb-1.5 block text-xs font-bold text-slate-600">Describe the issue</label><textarea maxLength={500} className="field min-h-[112px] resize-y" placeholder="E.g. Deep pothole near the school entrance, causing traffic to slow down..." value={note} onChange={e=>setNote(e.target.value)}/></div><button type="submit" disabled={processing} className="btn-primary w-full py-3">{processing?<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/> Running AI triage…</>:<><Sparkles size={16}/> Analyze & submit report</>}</button>{processing&&<div className="rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-800"><div className="mb-2 flex items-center gap-2"><Zap size={14}/> Computer vision + language analysis</div><div className="h-1.5 overflow-hidden rounded-full bg-emerald-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-emerald-600"/></div><div className="mt-2 text-emerald-700">Classifying issue · estimating severity · checking nearby reports…</div></div>}</div>
              <div><label className="mb-1.5 block text-xs font-bold text-slate-600">Attach supporting image <span className="font-normal text-slate-400">(optional demo input)</span></label><button type="button" onClick={()=>fileRef.current?.click()} className="flex min-h-[170px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40"><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(!f)return;if(!['image/png','image/jpeg','image/webp'].includes(f.type)){notify('Choose a PNG, JPG or WEBP image');e.target.value='';return}if(f.size>5*1024*1024){notify('Image must be 5 MB or smaller');e.target.value='';return}setImageName(f.name);setFileData(URL.createObjectURL(f))}}/>{fileData?<img src={fileData} alt="Selected issue" className="mb-3 max-h-28 rounded-lg object-cover"/>:<CloudUpload size={27} className="text-slate-400"/>}<span className="mt-2 text-sm font-bold text-slate-700">{imageName||'Upload an issue photo'}</span><span className="mt-1 text-xs text-slate-400">PNG, JPG or WEBP · local preview only</span></button><div className="mt-4 rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-700"><ShieldCheck size={15} className="text-emerald-700"/> Privacy-first prototype</div><p className="mt-1.5 text-xs leading-5 text-slate-500">This demo runs with local sample logic. Uploaded images are previewed in your browser and are not sent to a server.</p></div></div>
            </form>
            {result&&<div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900"><CheckCircle2 size={18}/> AI triage complete · {result.id}</div><span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-emerald-800">Added to live queue</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Detected category',result.category],['Severity score',result.severity+'/100'],['Duplicate check',result.duplicate],['Assigned municipal unit',result.unit]].map(([k,v])=><div key={k} className="rounded-xl bg-white p-3"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</div><div className="mt-1 text-sm font-bold text-slate-800">{v}</div></div>)}</div></div>}
          </div>
          <div className="mt-6"><SectionHeading eyebrow="Operations queue" title="All active reports" subtitle="Select a ticket to inspect its AI triage details."/><div className="mb-3 flex flex-wrap gap-2"><div className="relative min-w-[220px] flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="field pl-9" placeholder="Search reports, zones, departments or IDs…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select aria-label="Filter by status" className="field w-auto min-w-[155px]" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All statuses</option><option>Pending</option><option>Assigned</option><option>Dispatched</option><option>In progress</option></select><button onClick={()=>{setSelectedZone(null);setStatusFilter('All statuses');setSearch('')}} className="btn-secondary"><Filter size={15}/> Clear filters</button></div><ReportTable reports={filteredReports} onDispatch={dispatch} onResolve={resolve} onSelect={setSelectedReport}/></div>
        </>}

        {activeView==='optimizer' && <>
          <div className="grid gap-4 sm:grid-cols-3"><MetricCard label="Optimized allocation" value={money(124000)} detail="Illustrative planning envelope" icon={Wallet}/><MetricCard label="Priority projects" value="12" detail="Recommended for next dispatch cycle" icon={Gauge} tone="amber"/><MetricCard label="Projected efficiency gain" value="18.6%" detail="Compared with equal-share baseline" icon={TrendingUp} trend="Model estimate"/></div>
          <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><div className="panel p-5"><div className="eyebrow">Budget distribution · illustrative units</div><h3 className="mt-1 font-display text-lg font-extrabold text-slate-900">Traditional vs. AI-optimized allocation</h3><p className="mt-1 text-xs text-slate-400">Share of a sample maintenance budget by zone.</p><div className="mt-5 h-[290px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={allocationData} margin={{top:8,right:8,left:0,bottom:5}}><CartesianGrid stroke="#eef2f0" vertical={false}/><XAxis dataKey="zone" axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#64748b'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:10,fill:'#94a3b8'}} tickFormatter={v=>v+'%'}/><Tooltip formatter={v=>v+'%'} contentStyle={{borderRadius:12,border:'1px solid #e2e8f0',fontSize:12}}/><Bar dataKey="traditional" name="Traditional manual" fill="#cbd5e1" radius={[5,5,0,0]} barSize={23}/><Bar dataKey="optimized" name="CivicPulse AI" fill="#047857" radius={[5,5,0,0]} barSize={23}/></BarChart></ResponsiveContainer></div><div className="flex flex-wrap gap-4 text-xs text-slate-500"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-slate-300"/> Traditional manual</span><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-emerald-700"/> CivicPulse AI optimized</span></div></div><div className="panel p-5"><div className="eyebrow">Allocation principles</div><h3 className="mt-1 font-display text-lg font-extrabold text-slate-900">What drives priority?</h3><div className="mt-5 space-y-5">{[{label:'Public safety & severity',value:35,color:'#b45309'},{label:'Population affected',value:25,color:'#047857'},{label:'Service disruption',value:25,color:'#64748b'},{label:'Issue duration',value:15,color:'#0e7490'}].map(x=><div key={x.label}><div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold text-slate-600">{x.label}</span><span className="font-extrabold text-slate-800">{x.value}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{width:x.value+'%',background:x.color}}/></div></div>)}</div><div className="mt-7 rounded-xl bg-amber-50 p-3"><div className="flex items-center gap-2 text-xs font-bold text-amber-800"><AlertTriangle size={14}/> Decision support, not autopilot</div><p className="mt-1 text-xs leading-5 text-amber-900">Recommendations are illustrative and require review by municipal finance and operations teams.</p></div></div></div>
          <div className="mt-6"><SectionHeading eyebrow="Recommended action plan" title="Ranked maintenance projects" subtitle="Dispatch teams to the highest-urgency work first."/><ReportTable reports={[...activeReports].sort((a,b)=>b.severity-a.severity)} onDispatch={dispatch} onResolve={resolve} onSelect={setSelectedReport}/></div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-500"><span className="font-bold text-slate-700">Method note:</span> Allocation figures and savings are synthetic demonstration values, not audited financial outcomes or live city budget data. The prototype illustrates a prioritization workflow.</div>
        </>}

        <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-[11px] text-slate-400 sm:flex-row"><span>© 2026 CivicPulse AI · Smart Nation prototype</span><span className="flex items-center gap-1"><ShieldCheck size={13}/> Synthetic demo data · No live government integration</span></footer>
      </div>
    </main>
    {showReport&&<div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={()=>{setShowReport(false);setActiveView('reports')}}><div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="mb-4 flex items-center justify-between"><div><div className="eyebrow">Citizen portal</div><h3 className="font-display text-xl font-extrabold text-slate-900">Submit an issue report</h3></div><button onClick={()=>setShowReport(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18}/></button></div><p className="mb-4 text-sm text-slate-500">Your report will be processed by the local AI triage simulator and added to the authority dashboard.</p><div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">Go to <button onClick={()=>{setShowReport(false);setActiveView('reports')}} className="font-bold text-emerald-800 underline">Issue reports</button> to complete the report form.</div></div></div>}
    <ReportModal report={selectedReport} onClose={()=>setSelectedReport(null)}/>
    {toast&&<div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"><Check size={16} className="text-emerald-400"/>{toast}</div>}
  </div>
}

export default App
