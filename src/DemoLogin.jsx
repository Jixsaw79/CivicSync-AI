import { useState } from 'react'
import { Activity, ShieldCheck, UserRound, HardHat, ArrowRight, Eye, EyeOff } from 'lucide-react'

const accounts = [
  { email: 'citizen@civicsync.demo', password: 'Citizen@123', id: 'demo-citizen', name: 'Demo Citizen', role: 'citizen', label: 'Citizen', icon: UserRound, description: 'Submit issues and track their progress.' },
  { email: 'staff@civicsync.demo', password: 'Staff@123', id: 'demo-staff', name: 'Demo Staff', role: 'staff', label: 'Department staff', icon: HardHat, description: 'Work on assigned complaints and record progress.' },
  { email: 'admin@civicsync.demo', password: 'Admin@123', id: 'demo-admin', name: 'Demo Administrator', role: 'admin', label: 'Administrator', icon: ShieldCheck, description: 'Review reports, assign teams and monitor service trends.' },
]

export default function DemoLogin({ onLogin }) {
  const [email, setEmail] = useState(accounts[2].email)
  const [password, setPassword] = useState(accounts[2].password)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    const account = accounts.find((item) => item.email === email.trim().toLowerCase() && item.password === password)
    if (!account) {
      setError('Those demo credentials do not match. Use one of the sample accounts below.')
      return
    }
    setError('')
    onLogin({ id: account.id, name: account.name, role: account.role, email: account.email })
  }

  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-10 text-slate-800 dark:bg-[#0b1220] dark:text-slate-100">
      <div className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <section className="hidden lg:block">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-800 text-white"><Activity size={25} /></span>
            <div><div className="font-display text-2xl font-extrabold">CivicSync <span className="text-emerald-700 dark:text-emerald-400">AI</span></div><div className="text-xs font-semibold uppercase tracking-[.18em] text-slate-400">Urban intelligence</div></div>
          </div>
          <h1 className="mt-12 max-w-xl font-display text-5xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white">A clearer path from civic issue to resolution.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-500 dark:text-slate-400">A connected demonstration workflow for citizens, municipal staff and administrators.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400"><span className="rounded-full bg-white px-3 py-2 dark:bg-slate-900">Report issues</span><span className="rounded-full bg-white px-3 py-2 dark:bg-slate-900">Assign response teams</span><span className="rounded-full bg-white px-3 py-2 dark:bg-slate-900">Track progress</span></div>
        </section>
        <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-7 lg:hidden"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-800 text-white"><Activity size={22} /></span><div className="font-display text-xl font-extrabold">CivicSync <span className="text-emerald-700 dark:text-emerald-400">AI</span></div></div></div>
          <div className="eyebrow">Welcome back</div>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-950 dark:text-white">Sign in to CivicSync</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Choose a sample account to explore the role-specific prototype.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div><label htmlFor="demo-email" className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">Email</label><input id="demo-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="field min-h-12" /></div>
            <div><label htmlFor="demo-password" className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">Password</label><div className="relative"><input id="demo-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="field min-h-12 pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
            {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
            <button type="submit" className="btn-primary min-h-12 w-full">Sign in <ArrowRight size={16} /></button>
          </form>
          <div className="mt-7 border-t border-slate-100 pt-5 dark:border-slate-800"><div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Demo credentials</div><div className="mt-3 space-y-2">{accounts.map((account) => { const Icon = account.icon; return <button key={account.role} type="button" onClick={() => { setEmail(account.email); setPassword(account.password); setError('') }} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-500 hover:bg-emerald-50/50 dark:border-slate-700 dark:hover:bg-emerald-950/20"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Icon size={17} /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold text-slate-800 dark:text-slate-100">{account.label}</span><span className="block truncate text-[10px] text-slate-400">{account.email} · {account.password}</span></span></button> })}</div></div>
          <p className="mt-5 rounded-xl bg-amber-50 p-3 text-[10px] leading-5 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><strong>Prototype notice:</strong> These are public sample credentials for a browser-only demo. They are not real accounts, and this sign-in does not provide production authentication or server-enforced security.</p>
        </section>
      </div>
    </main>
  )
}
