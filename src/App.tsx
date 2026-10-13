import { useState, useEffect, useRef } from 'react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:        '#FAFAF8',
  white:     '#FFFFFF',
  text:      '#171717',
  muted:     '#626262',
  mutedLt:   '#9A9A9A',
  border:    '#E7E7E3',
  accent:    '#E5484D',
  accentDk:  '#C8292E',
  accentLt:  '#FF6B6B',
  softRed:   '#FFF0F0',
  navy:      '#172231',
  navyLt:    '#1E2D40',
  bluegray:  '#EEF2F5',
};

const GRAD_RED  = `linear-gradient(135deg, ${C.accent}, ${C.accentDk})`;
const GRAD_DARK = `linear-gradient(145deg, ${C.navy}, ${C.navyLt})`;

// ─── Primitives ───────────────────────────────────────────────────────────────
const M = ({ children, sz = 10, col = C.muted, style = {} }: {
  children: React.ReactNode; sz?: number; col?: string; style?: React.CSSProperties;
}) => (
  <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: sz, color: col, letterSpacing: '0.08em', ...style }}>
    {children}
  </span>
);

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <div style={{ marginBottom: 12 }}>
    <span style={{
      fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.14em',
      color: light ? 'rgba(255,255,255,.5)' : C.accent,
      background: light ? 'rgba(229,72,77,.12)' : C.softRed,
      padding: '4px 11px', borderRadius: 6, display: 'inline-block',
    }}>{children}</span>
  </div>
);

function GradBar() {
  return <div style={{ height: 2, background: `linear-gradient(90deg, ${C.accent}, ${C.accentLt}, transparent)`, borderRadius: 1, marginBottom: 0 }} />;
}

function ScoreBar({ label, score, delay = 0, go }: { label: string; score: number; delay?: number; go: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (go) { const t = setTimeout(() => setW(score), delay); return () => clearTimeout(t); }
    setW(0);
  }, [go, score, delay]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, fontFamily: 'Geist Mono,monospace', color: C.muted, width: 110, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${w}%`, background: GRAD_RED, borderRadius: 2, transition: 'width .9s ease' }} />
      </div>
      <M sz={12} col={C.white} style={{ fontWeight: 700, width: 22, textAlign: 'right' }}>{score}</M>
    </div>
  );
}

function WaveBars({ active, col = C.accent, count = 16 }: { active: boolean; col?: string; count?: number }) {
  const heights = [4,9,6,15,5,13,8,18,6,12,4,16,9,11,5,7].slice(0, count);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 20 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 2, backgroundColor: col, borderRadius: 1,
          height: active ? h : 3,
          animation: active ? `waveBar ${0.45 + (i % 5) * .07}s ease-in-out ${i * .04}s infinite alternate` : 'none',
          transformOrigin: 'center', transition: 'height .3s ease',
        }} />
      ))}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64,
      background: scrolled ? 'rgba(250,250,248,.94)' : 'rgba(250,250,248,.98)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
      transition: 'border-color .25s, background .25s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: GRAD_RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,.9)' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: C.text, letterSpacing: '-.02em' }}>Intrvw<span style={{ color: C.accent }}>.</span></span>
        </div>
        <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Product','Solutions','Candidates','Enterprises','Pricing'].map(l => (
            <a key={l} href="#" style={{ fontSize: 14, color: C.muted, textDecoration: 'none', fontWeight: 500, transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="#" style={{ fontSize: 14, color: C.muted, textDecoration: 'none', fontWeight: 500 }}>Sign In</a>
          <button className="btn-red" style={{ border: 'none', borderRadius: 10, padding: '9px 20px', fontSize: 14, fontWeight: 600, color: C.white, cursor: 'pointer', fontFamily: 'Geist,sans-serif' }}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO: Feature Showcase Animation ────────────────────────────────────────
type FeatureKey = 'resume' | 'ats' | 'mock' | 'enterprise' | 'instant';

const FEATURES: { key: FeatureKey; label: string; tag: string; sub: string }[] = [
  { key: 'resume',     label: 'AI Resume Builder',      tag: 'CANDIDATES',   sub: 'Build a job-winning resume in minutes' },
  { key: 'ats',        label: 'ATS Checker',            tag: 'CANDIDATES',   sub: 'Score against real ATS systems instantly' },
  { key: 'mock',       label: 'Mock Interview',         tag: 'CANDIDATES',   sub: 'Practice with an AI that evaluates live' },
  { key: 'enterprise', label: 'Enterprise Dashboard',   tag: 'ENTERPRISES',  sub: 'Manage every interview, campus to company' },
  { key: 'instant',    label: 'Instant Interview',      tag: 'ENTERPRISES',  sub: 'One link turns any job post into an interview' },
];

function ResumeUI() {
  return (
    <div className="animate-fadeUp" style={{ padding: '20px 0 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ height: 6, background: 'rgba(255,255,255,.85)', borderRadius: 3, width: 110, marginBottom: 4 }} />
            <div style={{ height: 3, background: 'rgba(255,255,255,.3)', borderRadius: 2, width: 80 }} />
          </div>
          <div style={{ background: GRAD_RED, borderRadius: 6, padding: '4px 10px' }}>
            <M sz={9} col={C.white}>AI WRITING</M>
          </div>
        </div>
        {[['EXPERIENCE','rgba(255,255,255,.4)',60],[null,'rgba(255,255,255,.15)',100],[null,'rgba(255,255,255,.12)',85],[null,'rgba(255,255,255,.1)',90]].map(([lbl, col, w], i) => (
          <div key={i}>
            {lbl && <div style={{ height: 2, background: 'rgba(255,255,255,.1)', margin: '8px 0 6px' }} />}
            {lbl && <div style={{ height: 3, background: 'rgba(255,255,255,.35)', borderRadius: 2, width: 60, marginBottom: 5, fontSize: 8 }} />}
            <div style={{ height: 3, background: col as string, borderRadius: 2, width: `${w}%`, marginBottom: 4 }} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
          {['React','Node.js','TypeScript'].map(s => (
            <span key={s} style={{ fontSize: 9, background: 'rgba(229,72,77,.2)', color: C.accentLt, padding: '2px 7px', borderRadius: 4 }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
        <M sz={10} col={C.accentLt}>AI generating experience bullets...</M>
      </div>
    </div>
  );
}

function ATSUI() {
  return (
    <div className="animate-fadeUp" style={{ padding: '20px 0 4px', display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{ position: 'relative', flexShrink: 0, width: 80, height: 80 }}>
        <svg viewBox="0 0 80 80" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
          <circle cx="40" cy="40" r="32" fill="none" stroke={C.accent} strokeWidth="7"
            strokeDasharray={`${2 * Math.PI * 32 * 0.92} ${2 * Math.PI * 32}`} strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(229,72,77,.5))' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 20, fontWeight: 700, color: C.white, lineHeight: 1 }}>92</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>ATS</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <M sz={9} col="rgba(255,255,255,.4)" style={{ display: 'block', marginBottom: 8 }}>KEYWORD MATCH</M>
        {[['React', true],['Node.js', true],['Python', true],['REST APIs', true],['Docker', false]].map(([k, match]) => (
          <div key={k as string} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: match ? '#4ADE80' : 'rgba(255,255,255,.3)', fontWeight: 600 }}>{match ? '✓' : '○'}</span>
            <span style={{ fontSize: 12, color: match ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.3)' }}>{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockUI() {
  const [chars, setChars] = useState(0);
  const text = "I worked on a real-time collaboration platform handling 10k concurrent users...";
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    setTimeout(() => {
      for (let i = 0; i <= text.length; i++) timers.push(setTimeout(() => setChars(i), i * 35));
    }, 400);
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="animate-fadeUp" style={{ padding: '20px 0 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${C.softRed}22`, border: `2px solid ${C.accent}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.accent, filter: 'drop-shadow(0 0 4px rgba(229,72,77,.6))' }} />
        </div>
        <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: 12, flex: 1 }}>
          <M sz={9} col={C.accentLt} style={{ display: 'block', marginBottom: 4 }}>AI Interviewer</M>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', lineHeight: 1.5, margin: 0 }}>&ldquo;Tell me about a challenging project you worked on.&rdquo;</p>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: 12 }}>
        <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 5 }}>LIVE TRANSCRIPT</M>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', lineHeight: 1.6, margin: 0 }}>
          {text.slice(0, chars)}<span className="cursor-blink" style={{ color: C.accent }}>|</span>
        </p>
      </div>
    </div>
  );
}

function EnterpriseUI() {
  return (
    <div className="animate-fadeUp" style={{ padding: '20px 0 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        {[['2,847','Candidates'],['1,243','Interviews'],['412','In Review'],['186','Shortlisted']].map(([v, l], i) => (
          <div key={l} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 14, fontWeight: 700, color: i === 3 ? C.accentLt : 'rgba(255,255,255,.9)' }}>{v}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        {[['Screening', 847],['Interview', 412],['Evaluation', 234],['Shortlist', 186]].map(([s, n], i) => (
          <div key={s} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ height: 2, background: i === 3 ? C.accent : 'rgba(255,255,255,.15)', borderRadius: 1, marginBottom: 6 }} />
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', marginBottom: 3 }}>{s}</div>
            <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 13, fontWeight: 600, color: i === 3 ? C.accentLt : 'rgba(255,255,255,.8)' }}>{n}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InstantUI() {
  const [lit, setLit] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLit(true), 600); return () => clearTimeout(t); }, []);
  return (
    <div className="animate-fadeUp" style={{ padding: '20px 0 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: 14 }}>
        <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 8 }}>COMPANY CAREERS PAGE</M>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.85)', marginBottom: 3 }}>Software Engineer</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 10 }}>Ahmedabad &middot; Full Time</div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
          {['React','Node.js','SQL'].map(r => (
            <span key={r} style={{ fontSize: 10, background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.5)', padding: '2px 8px', borderRadius: 5 }}>{r}</span>
          ))}
        </div>
        <div style={{ background: lit ? GRAD_RED : 'rgba(255,255,255,.08)', borderRadius: 8, padding: '10px 14px', textAlign: 'center', transition: 'background .5s ease', cursor: 'pointer', boxShadow: lit ? '0 0 20px rgba(229,72,77,.3)' : 'none' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>Start Interview &rarr;</span>
        </div>
      </div>
      {lit && (
        <div className="animate-fadeUp" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
          <M sz={10} col={C.accentLt}>Candidate entering interview flow...</M>
        </div>
      )}
    </div>
  );
}

function FeatureShowcase() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = (next: number) => {
    setVisible(false);
    setTimeout(() => { setIdx(next); setVisible(true); }, 320);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => advance((idx + 1) % FEATURES.length), 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [idx]);

  const feat = FEATURES[idx];

  const uis: Record<FeatureKey, React.ReactNode> = {
    resume: <ResumeUI key="resume" />,
    ats: <ATSUI key="ats" />,
    mock: <MockUI key="mock" />,
    enterprise: <EnterpriseUI key="enterprise" />,
    instant: <InstantUI key="instant" />,
  };

  return (
    <div style={{
      background: GRAD_DARK, borderRadius: 22, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,.07)',
      boxShadow: '0 24px 80px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.06)',
    }}>
      {/* Top gradient line */}
      <div style={{ height: 2, background: GRAD_RED }} />

      {/* Header */}
      <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[C.accent, '#F59E0B', '#22C55E'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: .8 }} />)}
        </div>
        <div style={{ background: 'rgba(229,72,77,.15)', borderRadius: 6, padding: '3px 10px' }}>
          <M sz={9} col={C.accentLt}>{feat.tag}</M>
        </div>
      </div>

      {/* Feature dots */}
      <div style={{ padding: '14px 22px 0', display: 'flex', gap: 5, alignItems: 'center' }}>
        {FEATURES.map((f, i) => (
          <button key={f.key} onClick={() => advance(i)} style={{
            width: i === idx ? 24 : 7, height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0,
            background: i === idx ? GRAD_RED : 'rgba(255,255,255,.15)',
            transition: 'all .3s ease',
          }} />
        ))}
        <M sz={9} col="rgba(255,255,255,.3)" style={{ marginLeft: 'auto' }}>{idx + 1} / {FEATURES.length}</M>
      </div>

      {/* Feature UI */}
      <div style={{ padding: '0 22px', minHeight: 200, opacity: visible ? 1 : 0, transition: 'opacity .3s ease' }}>
        {uis[feat.key]}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,.9)', marginBottom: 2 }}>{feat.label}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{feat.sub}</div>
        </div>
        <button onClick={() => advance((idx + 1) % FEATURES.length)} className="arrow-bounce" style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: 'rgba(255,255,255,.6)', fontSize: 16 }}>
          →
        </button>
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      paddingTop: 112, paddingBottom: 80,
      background: `${C.bg} radial-gradient(ellipse 900px 600px at 80% 0%, rgba(229,72,77,.07) 0%, transparent 70%)`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <Eyebrow>AI INTERVIEW &amp; HIRING PLATFORM</Eyebrow>
            <h1 style={{
              fontSize: 'clamp(44px, 5.5vw, 72px)', fontWeight: 800, lineHeight: 1.06,
              letterSpacing: '-.035em', color: C.text, margin: '0 0 22px',
            }}>
              Interviews,<br />
              <span className="grad-text">reimagined by AI.</span>
            </h1>
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, marginBottom: 36, maxWidth: 430 }}>
              Prepare candidates, evaluate talent and run interviews at scale&nbsp;&mdash; all from one intelligent platform.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <button className="btn-red" style={{ border: 'none', borderRadius: 12, padding: '14px 30px', fontSize: 15, fontWeight: 700, color: C.white, cursor: 'pointer', fontFamily: 'Geist,sans-serif', boxShadow: '0 4px 20px rgba(229,72,77,.35)' }}>
                Get Started &rarr;
              </button>
              <button className="btn-ghost" style={{ background: 'transparent', color: C.text, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '14px 30px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Geist,sans-serif' }}>
                Explore Platform
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: C.mutedLt }}>For Candidates &amp; Enterprises</span>
              <div style={{ height: 3, width: 3, borderRadius: '50%', background: C.border }} />
              <div style={{ display: 'flex', gap: 10 }}>
                {['Resume AI','ATS Check','Mock Interview','Enterprise'].map(f => (
                  <span key={f} style={{ fontSize: 11, color: C.mutedLt, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20, padding: '3px 9px' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Feature Showcase */}
          <div>
            <FeatureShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 02: PRODUCT OVERVIEW ────────────────────────────────────────────
function ProductOverview() {
  const cards = [
    {
      tag: 'FOR CANDIDATES', title: 'Prepare &amp; practice.', dark: false,
      items: ['AI Resume Builder', 'Intelligent ATS Checker', 'Mock Interview Practice'],
      ui: (
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: C.bg, borderRadius: 10, padding: 12 }}>
            <M sz={8} col={C.muted} style={{ display: 'block', marginBottom: 6 }}>RESUME AI</M>
            {[75,90,60,85].map((w,i) => <div key={i} style={{ height: 3, background: i===1?C.accent:C.border, borderRadius: 2, width: `${w}%`, marginBottom: 4 }} />)}
          </div>
          <div style={{ flex: 1, background: C.bg, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <div style={{ position: 'relative', width: 44, height: 44 }}>
              <svg viewBox="0 0 44 44" style={{ width:'100%',height:'100%',transform:'rotate(-90deg)' }}>
                <circle cx="22" cy="22" r="16" fill="none" stroke={C.border} strokeWidth="4" />
                <circle cx="22" cy="22" r="16" fill="none" stroke={C.accent} strokeWidth="4" strokeDasharray={`${2*Math.PI*16*.92} ${2*Math.PI*16}`} strokeLinecap="round" />
              </svg>
              <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <span style={{ fontSize:11,fontFamily:'Geist Mono,monospace',fontWeight:700,color:C.accent }}>92</span>
              </div>
            </div>
            <M sz={8} col={C.muted}>ATS Score</M>
          </div>
        </div>
      ),
    },
    {
      tag: 'FOR ENTERPRISES', title: 'Interview at scale.', dark: false,
      items: ['Campus Interview Management', 'Company Interview Management', 'Instant Interview Links'],
      ui: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[['1,243','Interviews'],['412','In Review']].map(([v,l]) => (
              <div key={l} style={{ background: C.bg, borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 16, fontFamily: 'Geist Mono,monospace', fontWeight: 700, color: C.text }}>{v}</div>
                <div style={{ fontSize: 9, color: C.muted }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.bg, borderRadius: 8, padding: 10 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Coding','Technical','Voice','Virtual+'].map(t => (
                <span key={t} style={{ fontSize: 9, background: C.white, border: `1px solid ${C.border}`, padding: '2px 7px', borderRadius: 5, color: C.muted }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: 'AI ENGINE', title: 'Always analyzing.', dark: true,
      items: ['Real-time transcript + scoring', 'Multi-dimensional evaluation', 'Instant structured reports'],
      ui: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[['Technical Depth',91],['Communication',84],['Problem Solving',89]].map(([l,v],i) => (
            <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontFamily: 'Geist Mono,monospace', color: 'rgba(255,255,255,.45)', width: 95, flexShrink: 0 }}>{l}</span>
              <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.1)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${v}%`, background: GRAD_RED, borderRadius: 2 }} />
              </div>
              <M sz={11} col={C.white} style={{ fontWeight: 700, width: 20, textAlign: 'right' }}>{v}</M>
            </div>
          ))}
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
            <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }} />
            <M sz={9} col={C.accentLt}>LIVE ANALYSIS RUNNING</M>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, background: C.white }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-.025em', color: C.text, margin: 0 }}>
            One intelligence layer for the<br /><span className="grad-text">entire interview journey.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {cards.map(card => (
            <div key={card.tag} className="hover-lift" style={{
              background: card.dark ? GRAD_DARK : C.bg,
              border: `1px solid ${card.dark ? 'rgba(255,255,255,.07)' : C.border}`,
              borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 18,
              boxShadow: card.dark ? '0 8px 32px rgba(0,0,0,.18)' : '0 1px 4px rgba(0,0,0,.04)',
              position: 'relative', overflow: 'hidden',
            }}>
              {card.dark && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: GRAD_RED }} />}
              <div>
                <Eyebrow light={card.dark}>{card.tag}</Eyebrow>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: card.dark ? C.white : C.text, letterSpacing: '-.02em', margin: 0 }}
                  dangerouslySetInnerHTML={{ __html: card.title }} />
              </div>
              <div style={{ flex: 1 }}>{card.ui}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {card.items.map(item => (
                  <li key={item} style={{ display: 'flex', gap: 9, fontSize: 12, color: card.dark ? 'rgba(255,255,255,.55)' : C.muted }}>
                    <span style={{ color: C.accent, fontWeight: 700, flexShrink: 0 }}>↗</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 03: CANDIDATE EXPERIENCE — REDESIGNED ───────────────────────────
type CandStep = 'resume' | 'ats' | 'mock';

function CandidateExperience() {
  const [active, setActive] = useState<CandStep>('resume');

  const steps: { key: CandStep; num: string; title: string; desc: string }[] = [
    { key: 'resume', num: '01', title: 'AI Resume Builder', desc: 'Describe your experience and let AI craft each bullet point — optimized for the role you want.' },
    { key: 'ats',    num: '02', title: 'Intelligent ATS Checker', desc: 'Scan your resume against job descriptions. See your score, missing keywords, and fix suggestions instantly.' },
    { key: 'mock',   num: '03', title: 'Mock Interview Practice', desc: 'Interview with an AI that listens, evaluates your answers live, and gives structured feedback after each session.' },
  ];

  const panels: Record<CandStep, React.ReactNode> = {
    resume: (
      <div key="resume" className="animate-fadeUp" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ height: 7, background: C.text, borderRadius: 3, width: 130, marginBottom: 5 }} />
              <div style={{ height: 3, background: C.border, borderRadius: 2, width: 90 }} />
            </div>
            <div style={{ background: GRAD_RED, borderRadius: 7, padding: '5px 12px' }}>
              <M sz={9} col={C.white} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: C.white, display: 'inline-block' }} /> AI WRITING
              </M>
            </div>
          </div>
          <GradBar />
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['EXPERIENCE', 'EDUCATION', 'SKILLS'].map((section, si) => (
              <div key={section}>
                <M sz={8} col={C.muted} style={{ display: 'block', marginBottom: 5 }}>{section}</M>
                {[100, 85, 70, 90].slice(0, 3 - si).map((w, i) => (
                  <div key={i} style={{ height: 3, background: si === 0 && i === 0 ? `linear-gradient(90deg, ${C.accent}, ${C.accentLt})` : C.border, borderRadius: 2, width: `${w}%`, marginBottom: 4, transition: 'width 1s ease' }} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 12 }}>
            {['React','Node.js','TypeScript','AWS','System Design'].map(s => (
              <span key={s} style={{ fontSize: 9, background: C.softRed, color: C.accent, padding: '3px 7px', borderRadius: 4 }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ background: C.softRed, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
          <M sz={11} col={C.accent}>AI is generating your experience bullets...</M>
        </div>
      </div>
    ),
    ats: (
      <div key="ats" className="animate-fadeUp" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                <svg viewBox="0 0 72 72" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="36" cy="36" r="28" fill="none" stroke={C.border} strokeWidth="6" />
                  <circle cx="36" cy="36" r="28" fill="none" stroke={C.accent} strokeWidth="6"
                    strokeDasharray={`${2*Math.PI*28*.92} ${2*Math.PI*28}`} strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px rgba(229,72,77,.4))` }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 18, fontWeight: 700, color: C.accent, lineHeight: 1 }}>92</span>
                  <span style={{ fontSize: 8, color: C.muted }}>ATS</span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Strong Match</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Resume aligns well with the role</p>
              </div>
            </div>
            <GradBar />
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <M sz={9} col={C.muted} style={{ display: 'block', marginBottom: 4 }}>KEYWORD ANALYSIS</M>
              {[['React', true, '14 matches'],['Node.js', true, '8 matches'],['REST APIs', true, '6 matches'],['Python', false, 'Not found'],['Kubernetes', false, 'Not found']].map(([k, match, info]) => (
                <div key={k as string} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: (match as boolean) ? '#F0FDF4' : '#FFF8F8', borderRadius: 7 }}>
                  <span style={{ fontSize: 13, color: (match as boolean) ? '#16A34A' : C.accent }}>{(match as boolean) ? '✓' : '×'}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text, flex: 1 }}>{k}</span>
                  <M sz={10} col={(match as boolean) ? '#16A34A' : C.accent}>{info}</M>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    mock: (
      <div key="mock" className="animate-fadeUp" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: GRAD_DARK, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ height: 2, background: GRAD_RED }} />
          <div style={{ padding: 18, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.softRed, border: `2px solid ${C.accent}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.accent }} />
            </div>
            <div>
              <M sz={9} col={C.accentLt} style={{ display: 'block', marginBottom: 4 }}>AI Interviewer &bull; LIVE</M>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', lineHeight: 1.5, margin: 0 }}>&ldquo;Walk me through your approach to designing a scalable microservices architecture.&rdquo;</p>
            </div>
          </div>
          <div style={{ padding: '0 18px 14px' }}>
            <WaveBars active={true} col={C.accent} count={20} />
          </div>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
          <M sz={9} col={C.muted} style={{ display: 'block', marginBottom: 10 }}>LIVE EVALUATION</M>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['Technical Depth', 88, 0],['Communication', 82, 80],['Problem Solving', 91, 160]].map(([l, v, d]) => (
              <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 11, color: C.muted, width: 110, flexShrink: 0 }}>{l}</span>
                <div style={{ flex: 1, height: 4, background: C.bg, borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${v}%`, background: GRAD_RED, borderRadius: 2 }} />
                </div>
                <M sz={12} col={C.text} style={{ fontWeight: 700, width: 22, textAlign: 'right' }}>{v}</M>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, background: C.bg, position: 'relative', overflow: 'hidden' }}>
      {/* bg gradient accent */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 400, height: 400, background: 'radial-gradient(circle, rgba(229,72,77,.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56, alignItems: 'start' }}>
          {/* Left: step selector */}
          <div>
            <Eyebrow>FOR CANDIDATES</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 800, letterSpacing: '-.025em', color: C.text, margin: '0 0 8px' }}>
              Prepare before<br />the real interview.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.65, marginBottom: 36 }}>
              Three tools. One platform. Built for the candidate who means business.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {steps.map(step => (
                <button key={step.key} onClick={() => setActive(step.key)} style={{
                  display: 'flex', gap: 16, alignItems: 'flex-start', textAlign: 'left', cursor: 'pointer', border: 'none',
                  background: active === step.key ? C.white : 'transparent',
                  borderRadius: 14, padding: '14px 16px', width: '100%', fontFamily: 'Geist,sans-serif',
                  borderLeft: `3px solid ${active === step.key ? C.accent : 'transparent'}`,
                  boxShadow: active === step.key ? '0 2px 12px rgba(0,0,0,.06)' : 'none',
                  transition: 'all .2s ease',
                }}>
                  <M sz={12} col={active === step.key ? C.accent : C.mutedLt} style={{ fontWeight: 700, marginTop: 1, flexShrink: 0 }}>{step.num}</M>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: active === step.key ? C.text : C.muted, marginBottom: 3 }}>{step.title}</div>
                    {active === step.key && (
                      <div className="animate-fadeUp" style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{step.desc}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <button className="btn-red" style={{ border: 'none', borderRadius: 12, padding: '12px 26px', fontSize: 14, fontWeight: 700, color: C.white, cursor: 'pointer', fontFamily: 'Geist,sans-serif', boxShadow: '0 4px 16px rgba(229,72,77,.3)' }}>
                Start Preparing Free &rarr;
              </button>
            </div>
          </div>

          {/* Right: live panel */}
          <div style={{ position: 'sticky', top: 84 }}>
            {panels[active]}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 04: ENTERPRISE PLATFORM ─────────────────────────────────────────
function EnterprisePlatform() {
  const [tab, setTab] = useState<'Campus' | 'Company'>('Campus');
  const data = {
    Campus:  [['2,847','Candidates'],['1,243','Interviews'],['412','In Review'],['186','Shortlisted']],
    Company: [['941','Candidates'],['387','Interviews'],['143','In Review'],['62','Shortlisted']],
  };
  const pipeline = [
    { s: 'Screening',  n: 847, cs: ['Aarav M.','Priya S.','Rohan K.'] },
    { s: 'Interview',  n: 412, cs: ['Sneha P.','Dev A.'] },
    { s: 'Evaluation', n: 234, cs: ['Karan T.','Isha R.'] },
    { s: 'Shortlist',  n: 186, cs: ['Meera J.'] },
  ];

  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, background: C.white }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <Eyebrow>FOR ENTERPRISES</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, letterSpacing: '-.025em', color: C.text, margin: 0 }}>
              Run every interview<br />from one place.
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 4, background: C.bg, borderRadius: 10, padding: 4 }}>
            {(['Campus','Company'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className="tab-pill" style={{
                padding: '8px 22px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Geist,sans-serif',
                background: tab === t ? C.white : 'transparent', color: tab === t ? C.text : C.muted,
                boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,.08)' : 'none',
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ height: 2, background: GRAD_RED }} />
          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: `1px solid ${C.border}` }}>
            {data[tab].map(([v, l], i) => (
              <div key={l} style={{ padding: '18px 22px', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
                <p style={{ fontSize: 11, color: C.muted, margin: '0 0 5px' }}>{l}</p>
                <p style={{ fontFamily: 'Geist Mono,monospace', fontSize: 22, fontWeight: 700, color: i === 3 ? C.accent : C.text, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
          {/* Pipeline */}
          <div style={{ padding: 22 }}>
            <M sz={9} col={C.muted} style={{ display: 'block', marginBottom: 14 }}>INTERVIEW PIPELINE</M>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {pipeline.map((p, i) => (
                <div key={p.s}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: i === 3 ? C.accent : C.text }}>{p.s}</span>
                    <M sz={11} col={i === 3 ? C.accent : C.muted}>{p.n}</M>
                  </div>
                  <div style={{ height: 2, borderRadius: 1, background: i === 3 ? GRAD_RED : C.border, marginBottom: 10 }} />
                  {p.cs.map(c => (
                    <div key={c} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 3 ? C.softRed : C.bluegray, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: i === 3 ? C.accent : C.navy }}>
                        {c[0]}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: C.text }}>{c}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 05: INTERVIEW TYPES ──────────────────────────────────────────────
type InterviewTab = 'Coding' | 'Technical' | 'Non-Technical' | 'Voice' | 'Virtual+';

function InterviewTypes() {
  const [active, setActive] = useState<InterviewTab>('Coding');
  const tabs: InterviewTab[] = ['Coding', 'Technical', 'Non-Technical', 'Voice', 'Virtual+'];

  const panels: Record<InterviewTab, React.ReactNode> = {
    Coding: (
      <div key="code" className="animate-fadeUp" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0, minHeight: 280 }}>
        <div style={{ padding: 24, borderRight: '1px solid rgba(255,255,255,.06)' }}>
          <M sz={8} col="rgba(255,255,255,.4)" style={{ display: 'block', marginBottom: 8 }}>PROBLEM · EASY</M>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,.9)', marginBottom: 8 }}>Two Sum</div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', lineHeight: 1.6, marginBottom: 12 }}>Given an integer array and a target, return indices of the two numbers that add up to target.</p>
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 8, padding: 10, marginBottom: 12 }}>
            <M sz={10} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 3 }}>EXAMPLE</M>
            <M sz={11} col="rgba(255,255,255,.7)">Input: [2,7,11,15], target=9</M><br />
            <M sz={11} col={C.accentLt}>Output: [0,1]</M>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: C.accent }} />
            <M sz={10} col={C.accentLt}>23:41 remaining</M>
          </div>
        </div>
        <div style={{ padding: 24, background: 'rgba(0,0,0,.2)', fontFamily: 'Geist Mono,monospace', fontSize: 11, lineHeight: 1.9, color: '#ccc' }}>
          <M sz={8} col="rgba(255,255,255,.3)" style={{ display: 'block', marginBottom: 10 }}>SOLUTION.JS</M>
          <div><span style={{ color: '#569cd6' }}>function</span> <span style={{ color: '#dcdcaa' }}>twoSum</span>(nums, target) {'{'}</div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: '#569cd6' }}>const</span> map = {'{}'};</div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: '#c586c0' }}>for</span> (<span style={{ color: '#569cd6' }}>let</span> i = 0; i &lt; nums.length; i++) {'{'}</div>
          <div style={{ paddingLeft: 32 }}><span style={{ color: '#569cd6' }}>const</span> comp = target - nums[i];</div>
          <div style={{ paddingLeft: 32 }}><span style={{ color: '#c586c0' }}>if</span> (comp <span style={{ color: '#569cd6' }}>in</span> map) <span style={{ color: '#c586c0' }}>return</span> [map[comp], i];</div>
          <div style={{ paddingLeft: 32 }}>map[nums[i]] = i;</div>
          <div style={{ paddingLeft: 16 }}>{'}'}</div>
          <div>{'}'}</div>
        </div>
      </div>
    ),
    Technical: (
      <div key="tech" className="animate-fadeUp" style={{ padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `rgba(229,72,77,.15)`, border: `2px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.accent }} />
            </div>
            <div>
              <M sz={9} col={C.accentLt} style={{ display: 'block', marginBottom: 3 }}>AI Interviewer</M>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', lineHeight: 1.5, margin: 0 }}>&ldquo;Explain the difference between TCP and UDP.&rdquo;</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: 14 }}>
            <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 5 }}>CANDIDATE</M>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', lineHeight: 1.65, margin: 0 }}>TCP provides reliable, ordered delivery with handshaking. UDP is connectionless and faster — ideal for streaming where some packet loss is acceptable...</p>
          </div>
        </div>
        <div>
          <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 12 }}>LIVE EVALUATION</M>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Technical Depth',88],['Clarity',82],['Accuracy',91]].map(([l,v],i) => (
              <ScoreBar key={l as string} label={l as string} score={v as number} delay={i*80} go={true} />
            ))}
          </div>
        </div>
      </div>
    ),
    'Non-Technical': (
      <div key="nontec" className="animate-fadeUp" style={{ padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 10 }}>BEHAVIORAL QUESTION</M>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.9)', lineHeight: 1.6, marginBottom: 14 }}>&ldquo;Describe a time you had to manage a conflict within your team.&rdquo;</p>
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: 14 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', lineHeight: 1.7, margin: 0 }}>Candidate delivers a structured STAR response explaining the conflict, their role, actions taken, and the positive resolution...</p>
          </div>
        </div>
        <div>
          <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 12 }}>AI EVALUATION</M>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[['Communication',91],['Empathy',85],['Leadership',78]].map(([l,v],i) => (
              <ScoreBar key={l as string} label={l as string} score={v as number} delay={i*80} go={true} />
            ))}
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['STAR Method','Conflict Resolution','Team Player'].map(t => (
              <span key={t} style={{ fontSize: 9, background: 'rgba(229,72,77,.15)', color: C.accentLt, padding: '3px 8px', borderRadius: 5 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    Voice: (
      <div key="voice" className="animate-fadeUp" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', gap: 2, height: 60, alignItems: 'center' }}>
          {[6,10,18,28,38,50,42,56,48,38,32,22,30,46,58,50,40,52,42,30,46,38,24,30,46,54,42,30,20,14,10,6].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: GRAD_RED, borderRadius: 2, opacity: 0.7 + (i%3)*.1, animation: `waveBar ${0.4+(i%7)*.06}s ease-in-out ${i*.03}s infinite alternate` }} />
          ))}
        </div>
        <div style={{ width: '100%', background: 'rgba(255,255,255,.06)', borderRadius: 12, padding: 18 }}>
          <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 6 }}>LIVE TRANSCRIPT</M>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', lineHeight: 1.7, margin: 0 }}>&ldquo;I believe the best approach would be to first identify the root cause by analyzing system logs, then implement a staged rollout to minimize impact on users...&rdquo;</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['Clarity',86],['Confidence',79],['Depth',88]].map(([l,v]) => (
            <div key={l} style={{ textAlign: 'center', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '10px 16px' }}>
              <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 18, fontWeight: 700, color: C.accentLt }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    'Virtual+': (
      <div key="virt" className="animate-fadeUp" style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '16/10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
          <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between' }}>
            <M sz={10} col="rgba(255,255,255,.5)">Aarav Mehta</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: C.accent }} />
              <M sz={9} col={C.accentLt}>LIVE</M>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: 12 }}>
            <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 5 }}>TRANSCRIPT</M>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', lineHeight: 1.6, margin: 0 }}>...achieved 99.9% uptime through distributed caching and load balancing across multiple regions...</p>
          </div>
          <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block' }}>ANALYSIS</M>
          {[['Technical',92],['Confidence',84]].map(([l,v],i) => (
            <ScoreBar key={l as string} label={l as string} score={v as number} delay={i*80} go={true} />
          ))}
        </div>
      </div>
    ),
  };

  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Eyebrow>INTERVIEW FORMATS</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, letterSpacing: '-.025em', color: C.text, margin: 0 }}>
            Every interview format.<br />One workflow.
          </h2>
        </div>
        <div style={{ background: GRAD_DARK, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,.06)', boxShadow: '0 12px 48px rgba(0,0,0,.18)' }}>
          <div style={{ height: 2, background: GRAD_RED }} />
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.06)', overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActive(t)} className="tab-pill" style={{
                padding: '15px 24px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Geist,sans-serif', whiteSpace: 'nowrap',
                color: active === t ? C.white : 'rgba(255,255,255,.4)',
                borderBottom: `2px solid ${active === t ? C.accent : 'transparent'}`,
              }}>{t}</button>
            ))}
          </div>
          <div style={{ minHeight: 280 }} key={active}>{panels[active]}</div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 06: INSTANT INTERVIEW ───────────────────────────────────────────
function InstantInterview() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 4), 1800);
    return () => clearInterval(t);
  }, []);
  const flow = ['Candidate Verification','AI Interview','Interview Complete','Enterprise Report'];

  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, background: GRAD_DARK, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: GRAD_RED }} />
      <div style={{ position: 'absolute', bottom: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(229,72,77,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow light>ENTERPRISE DIFFERENTIATOR</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-.025em', color: C.white, margin: '0 0 16px' }}>
            Turn every job opening into<br /><span className="grad-text">an interview opportunity.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', lineHeight: 1.65, maxWidth: 480, margin: '0 auto' }}>
            Add an Instant Interview link to your careers page and let candidates move directly from a job post into the interview.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr', gap: 0, alignItems: 'center' }}>
          {/* Company page */}
          <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.3)' }}>
            <div style={{ background: C.bg, padding: '8px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 5, alignItems: 'center' }}>
              {[C.accent,'#F59E0B','#22C55E'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: .8 }} />)}
              <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 14, marginLeft: 6, display: 'flex', alignItems: 'center', paddingLeft: 7 }}>
                <M sz={8} col={C.muted}>acmecorp.com/careers/swe</M>
              </div>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: GRAD_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: C.white }}>A</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>ACME Corp</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: '0 0 5px' }}>Software Engineer</h3>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 14px' }}>Ahmedabad &middot; Full Time &middot; ₹18–30 LPA</p>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: '0 0 14px' }}>We are looking for a skilled engineer to build scalable, high-performance products used by millions...</p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 18 }}>
                {['React','Node.js','SQL','REST APIs'].map(r => (
                  <span key={r} style={{ fontSize: 10, background: C.bluegray, color: C.navy, padding: '3px 8px', borderRadius: 5 }}>{r}</span>
                ))}
              </div>
              <div style={{ background: GRAD_RED, borderRadius: 10, padding: '12px 18px', textAlign: 'center', boxShadow: '0 4px 18px rgba(229,72,77,.35)', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>Start Interview &rarr;</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="arrow-bounce" style={{ fontSize: 22, color: 'rgba(229,72,77,.6)' }}>→</div>
          </div>

          {/* Flow */}
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 26 }}>
            <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 20 }}>INTERVIEW PLATFORM</M>
            {flow.map((s, i) => (
              <div key={s}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: step >= i ? GRAD_RED : 'rgba(255,255,255,.06)',
                    border: `2px solid ${step >= i ? C.accent : 'rgba(255,255,255,.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .4s ease', boxShadow: step >= i ? '0 0 12px rgba(229,72,77,.4)' : 'none',
                  }}>
                    {step > i
                      ? <span style={{ fontSize: 12, color: C.white }}>✓</span>
                      : <M sz={10} col={step === i ? C.white : 'rgba(255,255,255,.3)'}>{i + 1}</M>}
                  </div>
                  <span style={{ fontSize: 14, color: step >= i ? C.white : 'rgba(255,255,255,.35)', fontWeight: step === i ? 700 : 400, transition: 'all .4s ease' }}>
                    {s}
                    {i === 1 && step === 1 && (
                      <span style={{ marginLeft: 8 }}>
                        <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: C.accent, display: 'inline-block', marginRight: 4 }} />
                        <M sz={9} col={C.accentLt}>LIVE</M>
                      </span>
                    )}
                  </span>
                </div>
                {i < flow.length - 1 && (
                  <div style={{ marginLeft: 15, width: 2, height: 20, background: step > i ? C.accent : 'rgba(255,255,255,.08)', transition: 'background .4s ease', margin: '5px 0 5px 15px' }} />
                )}
              </div>
            ))}
            <div style={{ marginTop: 18, background: 'rgba(229,72,77,.08)', border: '1px solid rgba(229,72,77,.2)', borderRadius: 10, padding: 14 }}>
              <M sz={9} col="rgba(255,255,255,.35)" style={{ display: 'block', marginBottom: 3 }}>ENTERPRISE RECEIVES</M>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', margin: 0 }}>Structured AI report &bull; Score &bull; Recommendation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 07: INTERVIEW INTELLIGENCE ──────────────────────────────────────
function InterviewIntelligence() {
  const dims = [
    { label: 'Technical', score: 91 },
    { label: 'Communication', score: 84 },
    { label: 'Problem Solving', score: 92 },
    { label: 'Role Fit', score: 89 },
  ];
  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, background: C.white }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 48, alignItems: 'center' }}>
          <div>
            <Eyebrow>INTERVIEW INTELLIGENCE</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 800, letterSpacing: '-.025em', color: C.text, margin: '0 0 16px' }}>
              Every interview becomes structured insight.
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>
              AI-generated reports with dimension scores, strengths, improvement areas, and a hiring recommendation — delivered instantly.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Technical','Communication','Problem Solving','Role Fit'].map(d => (
                <span key={d} style={{ fontSize: 11, background: C.softRed, color: C.accent, padding: '4px 10px', borderRadius: 6, border: `1px solid rgba(229,72,77,.15)` }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Report card */}
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
            <div style={{ height: 2, background: GRAD_RED }} />
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.bluegray, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: C.navy }}>AM</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Aarav Mehta</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Software Engineer &bull; Ahmedabad</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <M sz={8} col={C.muted} style={{ display: 'block', marginBottom: 2 }}>OVERALL</M>
                <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 28, fontWeight: 800, color: C.accent }}>88</span>
                <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 14, color: C.muted }}>/100</span>
              </div>
            </div>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
              <M sz={9} col={C.muted} style={{ display: 'block', marginBottom: 12 }}>DIMENSION SCORES</M>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {dims.map((d, i) => (
                  <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: C.muted, width: 110, flexShrink: 0 }}>{d.label}</span>
                    <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${d.score}%`, background: GRAD_RED, borderRadius: 2 }} />
                    </div>
                    <M sz={13} col={C.text} style={{ fontWeight: 700, width: 22, textAlign: 'right' }}>{d.score}</M>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${C.border}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: '#F0FDF4', borderRadius: 10, padding: 12 }}>
                <M sz={8} col="#16A34A" style={{ display: 'block', marginBottom: 5 }}>STRENGTHS</M>
                {['System design','React ecosystem','Communication'].map(s => (
                  <div key={s} style={{ fontSize: 11, color: '#166534', marginBottom: 3 }}>&bull; {s}</div>
                ))}
              </div>
              <div style={{ background: '#FFFBEB', borderRadius: 10, padding: 12 }}>
                <M sz={8} col="#D97706" style={{ display: 'block', marginBottom: 5 }}>IMPROVE</M>
                {['DB optimization','Error handling'].map(s => (
                  <div key={s} style={{ fontSize: 11, color: '#92400E', marginBottom: 3 }}>&bull; {s}</div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px', background: C.softRed, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: C.white }}>✓</div>
                <M sz={11} col={C.accent} style={{ fontWeight: 600 }}>Recommended for recruiter review</M>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" style={{ padding: '8px 16px', borderRadius: 9, border: `1.5px solid ${C.border}`, background: C.white, fontSize: 12, fontWeight: 600, color: C.text, cursor: 'pointer', fontFamily: 'Geist,sans-serif' }}>Review</button>
                <button className="btn-red" style={{ padding: '8px 16px', borderRadius: 9, border: 'none', fontSize: 12, fontWeight: 600, color: C.white, cursor: 'pointer', fontFamily: 'Geist,sans-serif' }}>Move to Next Round</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 08: PRICING — 3 CARDS ───────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      tag: 'CANDIDATES', name: 'Free', price: '₹0', sub: 'Start your interview prep',
      features: ['AI Resume Builder', 'ATS Checker (3/month)', 'Mock Interviews (2/month)', 'Basic AI feedback'],
      cta: 'Start Free', dark: false, highlight: false,
    },
    {
      tag: 'CANDIDATES', name: 'Pro', price: '₹499', period: '/mo', sub: 'Land your dream role',
      features: ['Everything in Free', 'Unlimited ATS checks', 'Unlimited mock interviews', 'Detailed feedback reports', 'Performance analytics'],
      cta: 'Start Pro', dark: false, highlight: true,
    },
    {
      tag: 'ENTERPRISE', name: 'Enterprise', price: 'Custom', sub: 'For teams hiring at scale',
      features: ['Campus Interview Management', 'Company Interview Management', 'Coding + Technical + Voice', 'Virtual+ interviews', 'Instant Interview links', 'AI reports & analytics'],
      cta: 'Book Demo', dark: true, highlight: false,
    },
  ];

  return (
    <section style={{ paddingTop: 72, paddingBottom: 72, background: C.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <Eyebrow>PRICING</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, letterSpacing: '-.025em', color: C.text, margin: 0 }}>
            Choose how you want<br />to use the platform.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {plans.map(plan => (
            <div key={plan.name} className="hover-lift" style={{
              background: plan.dark ? GRAD_DARK : plan.highlight ? C.text : C.white,
              border: `1px solid ${plan.dark ? 'rgba(255,255,255,.07)' : plan.highlight ? 'transparent' : C.border}`,
              borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 20,
              boxShadow: plan.highlight ? '0 8px 40px rgba(0,0,0,.18)' : plan.dark ? '0 8px 32px rgba(0,0,0,.18)' : '0 1px 4px rgba(0,0,0,.04)',
              position: 'relative', overflow: 'hidden',
            }}>
              {plan.highlight && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: GRAD_RED }} />}
              {plan.dark    && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: GRAD_RED }} />}
              <div>
                <Eyebrow light={plan.dark || plan.highlight}>{plan.tag}</Eyebrow>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 32, fontWeight: 800, color: plan.dark || plan.highlight ? C.white : C.text }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: 14, color: plan.dark || plan.highlight ? 'rgba(255,255,255,.4)' : C.muted }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: 13, color: plan.dark || plan.highlight ? 'rgba(255,255,255,.45)' : C.muted, margin: 0 }}>{plan.sub}</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: plan.dark || plan.highlight ? 'rgba(255,255,255,.65)' : C.muted }}>
                    <span style={{ color: C.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button style={{
                width: '100%', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Geist,sans-serif',
                ...(plan.highlight || plan.dark
                  ? { background: GRAD_RED, border: 'none', color: C.white, boxShadow: '0 4px 18px rgba(229,72,77,.4)' }
                  : { background: 'transparent', border: `1.5px solid ${C.border}`, color: C.text }),
              }} className={plan.highlight || plan.dark ? 'btn-red' : 'btn-ghost'}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ paddingTop: 72, paddingBottom: 80, background: GRAD_DARK, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: GRAD_RED }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 700px 400px at 50% 100%, rgba(229,72,77,.08), transparent)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 40px', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-.03em', color: C.white, margin: '0 0 18px' }}>
          Prepare smarter.<br /><span className="grad-text">Interview better.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)', lineHeight: 1.65, marginBottom: 36 }}>
          One platform for candidate preparation and enterprise interviews.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-red" style={{ padding: '14px 32px', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 700, color: C.white, cursor: 'pointer', fontFamily: 'Geist,sans-serif', boxShadow: '0 6px 24px rgba(229,72,77,.4)' }}>
            Start for Free
          </button>
          <button className="btn-ghost" style={{ padding: '14px 32px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,.15)', background: 'transparent', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,.8)', cursor: 'pointer', fontFamily: 'Geist,sans-serif' }}>
            Book Enterprise Demo
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: 'Product',   links: ['AI Resume Builder','ATS Checker','Mock Interview','Campus Interviews','Company Interviews','Instant Interview'] },
    { title: 'Solutions', links: ['For Candidates','For Enterprises'] },
    { title: 'Company',   links: ['About','Contact','Security','Privacy','Terms'] },
  ];
  return (
    <footer style={{ background: C.white, borderTop: `1px solid ${C.border}`, padding: '48px 0 28px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: GRAD_RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,.9)' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, color: C.text }}>Intrvw<span style={{ color: C.accent }}>.</span></span>
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, maxWidth: 220 }}>AI-powered interview and hiring platform for candidates and enterprises.</p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 14, letterSpacing: '.01em' }}>{col.title}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 13, color: C.muted, textDecoration: 'none', transition: 'color .15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <M sz={12} col={C.mutedLt}>&copy; 2026 Intrvw. All rights reserved.</M>
          <M sz={11} col={C.mutedLt} style={{ letterSpacing: '0.1em' }}>PREPARE. INTERVIEW. HIRE.</M>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <Navbar />
      <main>
        <Hero />
        <ProductOverview />
        <CandidateExperience />
        <EnterprisePlatform />
        <InterviewTypes />
        <InstantInterview />
        <InterviewIntelligence />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
