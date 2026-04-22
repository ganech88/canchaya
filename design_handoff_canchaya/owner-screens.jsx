// CanchaYa — Owner dashboard (web)
// Editorial sports magazine aesthetic

// ─── Shared owner chrome ─────────────────────────────
function OwnerShell({ page = 'dashboard', children }) {
  const nav = [
    { id: 'dashboard', label: 'Dashboard', num: '01' },
    { id: 'calendar', label: 'Calendario', num: '02' },
    { id: 'courts', label: 'Canchas', num: '03' },
    { id: 'bookings', label: 'Reservas', num: '04' },
    { id: 'drinks', label: 'Consumo', num: '05' },
    { id: 'revenue', label: 'Ingresos', num: '06' },
    { id: 'settings', label: 'Config', num: '07' },
  ];
  return (
    <div className="cy-root" style={{ display: 'flex', height: '100%', background: 'var(--cy-bg)', fontFamily: 'var(--cy-ui)' }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: 'var(--cy-ink)', color: 'var(--cy-paper)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 16px', borderBottom: '1.5px solid rgba(255,255,255,0.15)' }}>
          <div className="cy-mono" style={{ fontSize: 9, letterSpacing: '.2em', color: 'var(--cy-accent)', fontWeight: 700 }}>CANCHAYA · OPS</div>
          <div className="cy-display" style={{ fontSize: 22, marginTop: 4, color: 'var(--cy-paper)' }}>LA BOMBO-<br/>NERITA</div>
          <div className="cy-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', marginTop: 4 }}>PALERMO · 4 CANCHAS</div>
        </div>
        <div style={{ flex: 1, padding: '10px 0' }}>
          {nav.map((n) => {
            const active = n.id === page;
            return (
              <div key={n.id} style={{
                padding: '10px 16px',
                display: 'flex', gap: 10, alignItems: 'center',
                background: active ? 'var(--cy-accent)' : 'transparent',
                color: active ? 'var(--cy-ink)' : 'var(--cy-paper)',
                borderLeft: active ? '4px solid var(--cy-ink)' : '4px solid transparent',
              }}>
                <span className="cy-mono" style={{ fontSize: 10, opacity: 0.6 }}>{n.num}</span>
                <span className="cy-cond" style={{ fontSize: 16 }}>{n.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: 16, borderTop: '1.5px solid rgba(255,255,255,0.15)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, background: 'var(--cy-accent)', border: '1.5px solid var(--cy-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cy-display)', fontSize: 14, color: 'var(--cy-ink)' }}>DP</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Diego P.</div>
            <div className="cy-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,.5)' }}>ADMIN</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
}

function OwnerHeader({ eyebrow, title, right }) {
  return (
    <div style={{ padding: '22px 28px 20px', borderBottom: '2px solid var(--cy-line)', background: 'var(--cy-paper)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ {eyebrow}</div>
        <div className="cy-display" style={{ fontSize: 48, marginTop: 6 }}>{title}</div>
      </div>
      <div>{right}</div>
    </div>
  );
}

// ─── 01 · DASHBOARD ─────────────────────────────────
function OwnerDashboard() {
  return (
    <OwnerShell page="dashboard">
      <OwnerHeader
        eyebrow="VISTA GENERAL · HOY · MAR 22"
        title={<>BUENOS DÍAS,<br/>DIEGO.</>}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="cy-btn cy-btn-ghost" style={{ padding: '10px 14px', fontSize: 12 }}>EXPORTAR</div>
            <div className="cy-btn cy-btn-accent" style={{ padding: '10px 14px', fontSize: 12 }}>+ BLOQUEAR TURNO</div>
          </div>
        }
      />

      {/* KPI grid */}
      <div style={{ padding: '0 28px', borderBottom: '2px solid var(--cy-line)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { k: 'RESERVAS HOY', v: '24', delta: '+18%', sub: '17 F5 · 5 PÁDEL · 2 F8', bg: 'var(--cy-paper)' },
            { k: 'INGRESOS HOY', v: '$438K', delta: '+24%', sub: '$310K canchas · $128K bar', bg: 'var(--cy-accent)' },
            { k: 'OCUPACIÓN', v: '82%', delta: '+6pts', sub: '4 canchas · 14h activas', bg: 'var(--cy-paper)' },
            { k: 'CLIENTES', v: '186', delta: '+32', sub: '48 nuevos este mes', bg: 'var(--cy-paper)' },
          ].map((kpi, i) => (
            <div key={kpi.k} style={{ padding: '22px 20px', borderRight: i<3 ? '1.5px solid var(--cy-line)' : 'none', background: kpi.bg }}>
              <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.16em', color: 'var(--cy-muted)', fontWeight: 700 }}>{kpi.k}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                <div className="cy-display" style={{ fontSize: 56 }}>{kpi.v}</div>
                <div className="cy-mono" style={{ fontSize: 11, fontWeight: 700 }}>{kpi.delta}</div>
              </div>
              <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)', marginTop: 4 }}>{kpi.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 col body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 0, borderBottom: '2px solid var(--cy-line)' }}>
        {/* Today timeline */}
        <div style={{ padding: 28, borderRight: '2px solid var(--cy-line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div>
              <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ AGENDA DEL DÍA</div>
              <div className="cy-cond" style={{ fontSize: 30 }}>Próximos turnos</div>
            </div>
            <span className="cy-mono" style={{ fontSize: 10 }}>VER CALENDARIO →</span>
          </div>
          <hr className="cy-rule-thick" style={{ margin: 0 }}/>

          {/* Timeline rows */}
          {[
            { t: '19:00', dur: '1h', court: 'F5 · C1', who: 'Martín B.', n: '10 pers.', st: 'CONFIRMADA', stBg: 'var(--cy-ink)' },
            { t: '19:00', dur: '1h', court: 'F5 · C2', who: 'Empresa XYZ', n: '10 pers.', st: 'PAGADA', stBg: 'var(--cy-accent)' },
            { t: '20:00', dur: '1.5h', court: 'PÁDEL · P1', who: 'Laura / Nico', n: '4 pers.', st: 'CONFIRMADA', stBg: 'var(--cy-ink)' },
            { t: '20:30', dur: '1h', court: 'F5 · C3', who: 'Abierto #124', n: '8/10', st: 'FALTAN 2', stBg: 'var(--cy-red)' },
            { t: '21:00', dur: '1h', court: 'F8 · C4', who: 'Los Veteranos', n: '16 pers.', st: 'RECURRENTE', stBg: 'var(--cy-ink)' },
            { t: '22:00', dur: '1h', court: 'F5 · C1', who: 'Reserva app', n: '10 pers.', st: 'SEÑADO', stBg: 'var(--cy-ink)' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 90px 1fr 100px 110px', padding: '10px 0', borderBottom: '1px solid var(--cy-line)', alignItems: 'center', gap: 10 }}>
              <div>
                <div className="cy-display" style={{ fontSize: 22 }}>{r.t}</div>
                <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>{r.dur}</div>
              </div>
              <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700 }}>{r.court}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.who}</div>
              </div>
              <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)' }}>{r.n}</div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-block', background: r.stBg, color: r.stBg === 'var(--cy-accent)' ? 'var(--cy-ink)' : 'var(--cy-paper)', fontFamily: 'var(--cy-mono)', fontSize: 9, letterSpacing: '.12em', fontWeight: 700, padding: '3px 8px', border: '1.5px solid var(--cy-line)' }}>{r.st}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right col: live mini-map + alerts */}
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ AHORA MISMO · 19:42</div>
            <div className="cy-cond" style={{ fontSize: 26, marginTop: 2 }}>Canchas en vivo</div>
            <hr className="cy-rule-thick" style={{ margin: '8px 0 0' }}/>

            {[
              { c: 'C1 · F5', occ: 'EN JUEGO', who: 'Los Muchachos', t: '19:00 – 20:00', pct: 68 },
              { c: 'C2 · F5', occ: 'EN JUEGO', who: 'Empresa XYZ', t: '19:00 – 20:00', pct: 68 },
              { c: 'C3 · F5', occ: 'LIBRE', who: '— próximo 20:30', t: '—', pct: 0 },
              { c: 'P1 · PÁDEL', occ: 'LIBRE', who: '— próximo 20:00', t: '—', pct: 0 },
            ].map((c, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--cy-line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="cy-cond" style={{ fontSize: 16 }}>{c.c}</span>
                  <span className="cy-mono" style={{ fontSize: 10, fontWeight: 700, color: c.occ === 'EN JUEGO' ? 'var(--cy-red)' : 'var(--cy-muted)' }}>● {c.occ}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--cy-muted)', marginTop: 2 }}>{c.who} · {c.t}</div>
                {c.pct > 0 && (
                  <div style={{ height: 4, background: 'var(--cy-sand)', marginTop: 6, position: 'relative' }}>
                    <div style={{ width: `${c.pct}%`, height: '100%', background: 'var(--cy-red)' }}/>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ ALERTAS</div>
            <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-accent)', padding: 12, marginTop: 8 }}>
              <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700 }}>⚡ STOCK BAJO</div>
              <div style={{ fontSize: 12, marginTop: 2 }}>Gatorade Naranja · quedan 8 unidades</div>
            </div>
            <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-paper)', padding: 12, marginTop: 8 }}>
              <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700 }}>📅 RECURRENCIA</div>
              <div style={{ fontSize: 12, marginTop: 2 }}>Los Veteranos renovaron trimestre · $312K cobrados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Drinks + Revenue row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: 28, borderRight: '2px solid var(--cy-line)' }}>
          <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ RANKING DEL MES</div>
          <div className="cy-cond" style={{ fontSize: 26 }}>Bebidas más vendidas</div>
          <hr className="cy-rule-thick" style={{ margin: '8px 0 14px' }}/>
          {[
            { r: 1, n: 'Cerveza Quilmes 1L', u: 284, v: '$340K' },
            { r: 2, n: 'Gatorade Naranja 500ml', u: 211, v: '$148K' },
            { r: 3, n: 'Coca-Cola 500ml', u: 198, v: '$118K' },
            { r: 4, n: 'Agua Mineral 500ml', u: 176, v: '$88K' },
            { r: 5, n: 'Powerade Azul 500ml', u: 142, v: '$98K' },
          ].map((d) => (
            <div key={d.r} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px 80px', padding: '10px 0', borderBottom: '1px solid var(--cy-line)', alignItems: 'baseline', gap: 10 }}>
              <span className="cy-display" style={{ fontSize: 26, color: d.r === 1 ? 'var(--cy-red)' : 'var(--cy-ink)' }}>{String(d.r).padStart(2,'0')}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{d.n}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: 'var(--cy-sand)' }}>
                  <div style={{ width: `${(d.u/284)*100}%`, height: '100%', background: 'var(--cy-ink)' }}/>
                </div>
                <span className="cy-mono" style={{ fontSize: 10 }}>{d.u}</span>
              </div>
              <span className="cy-mono" style={{ fontSize: 12, fontWeight: 700, textAlign: 'right' }}>{d.v}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: 28 }}>
          <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ INGRESOS · 30 DÍAS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="cy-cond" style={{ fontSize: 26 }}>$8.4M</div>
            <span className="cy-mono" style={{ fontSize: 11, fontWeight: 700 }}>+22% vs mes anterior</span>
          </div>
          <hr className="cy-rule-thick" style={{ margin: '4px 0 14px' }}/>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160, padding: '10px 0', borderBottom: '1.5px solid var(--cy-line)' }}>
            {[42,58,51,72,64,80,92,68,77,85,90,63,74,88,95,82,70,91,98,86,73,90,102,88,79,95,110,94,88,100].map((h,i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse' }}>
                <div style={{ height: `${h*1.2}px`, background: i === 29 ? 'var(--cy-red)' : (i >= 22 ? 'var(--cy-ink)' : 'var(--cy-muted)'), border: '1px solid var(--cy-line)' }}/>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>FEB 22</span>
            <span className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>HOY</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 14 }}>
            {[
              { k: 'CANCHAS', v: '$6.1M' },
              { k: 'BAR', v: '$1.8M' },
              { k: 'EXTRAS', v: '$0.5M' },
            ].map((x) => (
              <div key={x.k} style={{ border: '1.5px solid var(--cy-line)', padding: 10 }}>
                <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>{x.k}</div>
                <div className="cy-display" style={{ fontSize: 20, marginTop: 2 }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OwnerShell>
  );
}

// ─── 02 · CALENDARIO SEMANAL ───────────────────────
function OwnerCalendar() {
  const days = ['LUN 22','MAR 23','MIÉ 24','JUE 25','VIE 26','SÁB 27','DOM 28'];
  const hours = ['14','15','16','17','18','19','20','21','22','23'];

  // sample reservations { day, start, end, court, who, color }
  const r = [
    { d: 0, s: 19, e: 20, court: 'C1', who: 'Martín B.', color: 'var(--cy-ink)' },
    { d: 0, s: 19, e: 20, court: 'C2', who: 'Emp. XYZ', color: 'var(--cy-accent)' },
    { d: 0, s: 20, e: 21.5, court: 'P1', who: 'Laura/Nico', color: 'var(--cy-ink)' },
    { d: 0, s: 21, e: 22, court: 'C4', who: 'Veteranos', color: 'var(--cy-red)' },
    { d: 1, s: 18, e: 19, court: 'C1', who: 'Pablo', color: 'var(--cy-ink)' },
    { d: 1, s: 20, e: 21, court: 'C2', who: 'Abierto', color: 'var(--cy-accent)' },
    { d: 2, s: 17, e: 18, court: 'P1', who: 'Ana', color: 'var(--cy-ink)' },
    { d: 2, s: 20, e: 21, court: 'C1', who: 'Juan', color: 'var(--cy-ink)' },
    { d: 3, s: 19, e: 20, court: 'C3', who: 'Abierto', color: 'var(--cy-accent)' },
    { d: 3, s: 21, e: 22, court: 'C4', who: 'Veteranos', color: 'var(--cy-red)' },
    { d: 4, s: 18, e: 20, court: 'C1', who: 'Torneo', color: 'var(--cy-red)' },
    { d: 4, s: 20, e: 21, court: 'P1', who: 'Nico', color: 'var(--cy-ink)' },
    { d: 4, s: 21, e: 22, court: 'C2', who: 'Privada', color: 'var(--cy-ink)' },
    { d: 5, s: 15, e: 17, court: 'C1', who: 'Cumpleaños', color: 'var(--cy-accent)' },
    { d: 5, s: 17, e: 18, court: 'P1', who: 'Clases', color: 'var(--cy-ink)' },
    { d: 5, s: 20, e: 22, court: 'C3', who: 'Torneo F5', color: 'var(--cy-red)' },
    { d: 6, s: 16, e: 17, court: 'C2', who: 'Familiar', color: 'var(--cy-ink)' },
    { d: 6, s: 19, e: 20, court: 'P1', who: 'Recurrente', color: 'var(--cy-ink)' },
  ];

  return (
    <OwnerShell page="calendar">
      <OwnerHeader
        eyebrow="SEMANA · 22—28 MAR 2026"
        title="CALENDARIO."
        right={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', border: '2px solid var(--cy-line)' }}>
              <div className="cy-btn cy-btn-ghost" style={{ padding: '8px 12px', fontSize: 11, border: 'none', borderRight: '1.5px solid var(--cy-line)' }}>DÍA</div>
              <div className="cy-btn cy-btn-accent" style={{ padding: '8px 12px', fontSize: 11, border: 'none' }}>SEMANA</div>
              <div className="cy-btn cy-btn-ghost" style={{ padding: '8px 12px', fontSize: 11, border: 'none', borderLeft: '1.5px solid var(--cy-line)' }}>MES</div>
            </div>
            <div className="cy-btn cy-btn-accent" style={{ padding: '10px 14px', fontSize: 12 }}>+ RESERVA</div>
          </div>
        }
      />

      {/* Legend */}
      <div style={{ padding: '14px 28px', borderBottom: '1.5px solid var(--cy-line)', background: 'var(--cy-paper)', display: 'flex', gap: 18, alignItems: 'center' }}>
        <span className="cy-mono" style={{ fontSize: 10, fontWeight: 700 }}>LEYENDA:</span>
        {[
          { c: 'var(--cy-ink)', l: 'Reservado' },
          { c: 'var(--cy-accent)', l: 'Pagado' },
          { c: 'var(--cy-red)', l: 'Evento / Recurrente' },
          { c: 'var(--cy-sand)', l: 'Bloqueado' },
        ].map((x) => (
          <span key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <span style={{ width: 14, height: 14, background: x.c, border: '1.5px solid var(--cy-line)' }}/>
            {x.l}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7,1fr)', border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
          {/* header row */}
          <div style={{ background: 'var(--cy-ink)', color: 'var(--cy-accent)', padding: '10px 6px', fontFamily: 'var(--cy-mono)', fontSize: 9, letterSpacing: '.14em', fontWeight: 700 }}>HORA</div>
          {days.map((d,i) => (
            <div key={d} style={{ background: i===0 ? 'var(--cy-accent)' : 'var(--cy-ink)', color: i===0 ? 'var(--cy-ink)' : 'var(--cy-accent)', padding: '10px 8px', borderLeft: '1.5px solid var(--cy-line)' }}>
              <div className="cy-mono" style={{ fontSize: 9, letterSpacing: '.12em' }}>{d.split(' ')[0]}</div>
              <div className="cy-display" style={{ fontSize: 20 }}>{d.split(' ')[1]}</div>
            </div>
          ))}

          {/* hour rows */}
          {hours.map((h, hi) => (
            <React.Fragment key={h}>
              <div style={{ padding: '4px 6px', borderTop: '1.5px solid var(--cy-line)', fontFamily: 'var(--cy-mono)', fontSize: 10, color: 'var(--cy-muted)', fontWeight: 700, minHeight: 60, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 4, right: 6 }}>{h}h</span>
              </div>
              {days.map((_, di) => {
                const cellBookings = r.filter(x => x.d === di && Math.floor(x.s) === parseInt(h));
                return (
                  <div key={di} style={{ borderTop: '1.5px solid var(--cy-line)', borderLeft: '1.5px solid var(--cy-line)', minHeight: 60, position: 'relative', padding: 2 }}>
                    {cellBookings.map((b, bi) => {
                      const height = (b.e - b.s) * 60;
                      const offset = (b.s - parseInt(h)) * 60;
                      return (
                        <div key={bi} style={{
                          position: 'absolute', left: 2 + bi*2, right: 2, top: 2 + offset,
                          height: height - 4,
                          background: b.color,
                          color: b.color === 'var(--cy-accent)' ? 'var(--cy-ink)' : 'var(--cy-paper)',
                          border: '1.5px solid var(--cy-line)',
                          padding: '4px 6px',
                          overflow: 'hidden', zIndex: bi+1,
                        }}>
                          <div className="cy-mono" style={{ fontSize: 8, letterSpacing: '.12em', fontWeight: 700, opacity: .8 }}>{b.court}</div>
                          <div className="cy-cond" style={{ fontSize: 13 }}>{b.who}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Footer stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', marginTop: 18, border: '2px solid var(--cy-line)' }}>
          {[
            { k: 'RESERVAS', v: '148' },
            { k: 'INGRESOS', v: '$2.4M' },
            { k: 'OCUPACIÓN', v: '78%' },
            { k: 'HUECOS LIBRES', v: '22h' },
          ].map((s,i) => (
            <div key={s.k} style={{ padding: 16, borderRight: i<3 ? '1.5px solid var(--cy-line)' : 'none', background: i===1 ? 'var(--cy-accent)' : 'var(--cy-paper)' }}>
              <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>{s.k}</div>
              <div className="cy-display" style={{ fontSize: 28 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </OwnerShell>
  );
}

// ─── 03 · GESTIÓN DE CANCHAS ───────────────────────
function OwnerCourts() {
  const courts = [
    { name: 'C1 · Fútbol 5', surface: 'Sintético', covered: true, price: 18000, status: 'ACTIVA', occ: 92, img: 'field' },
    { name: 'C2 · Fútbol 5', surface: 'Sintético', covered: true, price: 18000, status: 'ACTIVA', occ: 88, img: 'field' },
    { name: 'C3 · Fútbol 5', surface: 'Sintético', covered: false, price: 16000, status: 'ACTIVA', occ: 74, img: 'field' },
    { name: 'C4 · Fútbol 8', surface: 'Césped natural', covered: false, price: 26000, status: 'ACTIVA', occ: 68, img: 'field' },
    { name: 'P1 · Pádel', surface: 'Cemento', covered: true, price: 9500, status: 'ACTIVA', occ: 84, img: 'dark' },
    { name: 'P2 · Pádel', surface: 'Cemento', covered: true, price: 9500, status: 'MANTENIMIENTO', occ: 0, img: 'dark' },
  ];
  return (
    <OwnerShell page="courts">
      <OwnerHeader
        eyebrow="INVENTARIO · 6 CANCHAS"
        title="CANCHAS."
        right={<div className="cy-btn cy-btn-accent" style={{ padding: '10px 14px', fontSize: 12 }}>+ AGREGAR CANCHA</div>}
      />

      {/* Tabs */}
      <div style={{ padding: '12px 28px', borderBottom: '1.5px solid var(--cy-line)', background: 'var(--cy-paper)', display: 'flex', gap: 6 }}>
        {['TODAS (6)','FÚTBOL (4)','PÁDEL (2)','TENIS (0)','INACTIVAS (1)'].map((t,i) => (
          <span key={t} className={i===0 ? 'cy-chip cy-chip-fill' : 'cy-chip'}>{t}</span>
        ))}
      </div>

      <div style={{ padding: 28, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
        {courts.map((c,i) => (
          <div key={c.name} style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
            <div className={`cy-img-placeholder ${c.img}`} style={{ height: 120, borderLeft: 0, borderRight: 0, borderTop: 0, position: 'relative' }}>
              <span>FOTO</span>
              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                <Chip fill>{c.status}</Chip>
              </div>
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <Chip accent>N°{String(i+1).padStart(2,'0')}</Chip>
              </div>
            </div>
            <div style={{ padding: 14 }}>
              <div className="cy-display" style={{ fontSize: 20 }}>{c.name}</div>
              <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)', marginTop: 4 }}>
                {c.surface.toUpperCase()} · {c.covered ? 'TECHADA' : 'AL AIRE LIBRE'}
              </div>

              <hr className="cy-rule" style={{ margin: '10px 0' }}/>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>PRECIO / HORA</div>
                  <div className="cy-display" style={{ fontSize: 22 }}>${(c.price/1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>OCUPACIÓN 30d</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <div className="cy-display" style={{ fontSize: 22 }}>{c.occ}%</div>
                  </div>
                  <div style={{ height: 4, background: 'var(--cy-sand)', marginTop: 4 }}>
                    <div style={{ width: `${c.occ}%`, height: '100%', background: c.occ > 80 ? 'var(--cy-red)' : 'var(--cy-ink)' }}/>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <div className="cy-btn cy-btn-ghost" style={{ flex: 1, fontSize: 11, padding: '8px 10px' }}>EDITAR</div>
                <div className="cy-btn cy-btn-accent" style={{ flex: 1, fontSize: 11, padding: '8px 10px' }}>TARIFAS</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </OwnerShell>
  );
}

// ─── 04 · DETALLE DE RESERVA ───────────────────────
function OwnerBookingDetail() {
  return (
    <OwnerShell page="bookings">
      <OwnerHeader
        eyebrow="RESERVA · N°00248"
        title={<>LOS VETE-<br/>RANOS F8</>}
        right={<div style={{ display: 'flex', gap: 8 }}><div className="cy-btn cy-btn-ghost" style={{ padding: '10px 14px', fontSize: 12 }}>CANCELAR</div><div className="cy-btn cy-btn-accent" style={{ padding: '10px 14px', fontSize: 12 }}>MARCAR COMO FINALIZADA</div></div>}
      />

      <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        <div>
          <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--cy-line)', background: 'var(--cy-ink)', color: 'var(--cy-accent)' }}>
              <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', fontWeight: 700 }}>§ TURNO · SÁBADO 27 MAR</div>
              <Chip accent>PAGADA</Chip>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
              {[
                { k: 'HORA', v: '21:00' },
                { k: 'DURACIÓN', v: '1h' },
                { k: 'CANCHA', v: 'C4 · F8' },
                { k: 'PERSONAS', v: '16' },
              ].map((s,i) => (
                <div key={s.k} style={{ padding: 16, borderRight: i<3 ? '1.5px solid var(--cy-line)' : 'none' }}>
                  <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>{s.k}</div>
                  <div className="cy-display" style={{ fontSize: 26 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle económico */}
          <div style={{ marginTop: 20, border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
            <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', padding: '10px 16px', borderBottom: '1.5px solid var(--cy-line)', fontWeight: 700, color: 'var(--cy-red)' }}>§ DETALLE ECONÓMICO</div>
            {[
              { k: 'Cancha F8 · 1 h', v: '$26.000' },
              { k: 'Pelotas (x2)', v: '$1.600' },
              { k: 'Bebidas (barra)', v: '$18.400' },
              { k: 'Descuento recurrente (-10%)', v: '-$4.600' },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding: '10px 16px', borderBottom: '1px solid var(--cy-line)' }}>
                <span style={{ fontSize: 13 }}>{r.k}</span>
                <span className="cy-mono" style={{ fontSize: 12, fontWeight: 700 }}>{r.v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding: '14px 16px', background: 'var(--cy-accent)' }}>
              <span className="cy-display" style={{ fontSize: 22 }}>TOTAL</span>
              <span className="cy-display" style={{ fontSize: 28 }}>$41.400</span>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop: 20 }}>
            <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ HISTORIAL</div>
            <div className="cy-cond" style={{ fontSize: 22, marginBottom: 8 }}>Eventos</div>
            <hr className="cy-rule-thick" style={{ margin: 0 }}/>
            {[
              { d: '27 MAR · 22:02', t: 'Turno finalizado' },
              { d: '27 MAR · 21:05', t: 'Check-in confirmado (16 personas)' },
              { d: '27 MAR · 18:30', t: 'Pago recibido · $41.400 · Mercado Pago' },
              { d: '24 MAR · 11:40', t: 'Reserva creada por Ramón G.' },
            ].map((e,i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--cy-line)' }}>
                <div className="cy-mono" style={{ fontSize: 10, width: 130, color: 'var(--cy-muted)' }}>{e.d}</div>
                <div style={{ fontSize: 13 }}>{e.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-paper)', padding: 16 }}>
            <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)', letterSpacing: '.14em', fontWeight: 700 }}>TITULAR</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
              <div className="cy-img-placeholder accent" style={{ width: 52, height: 52, fontSize: 8 }}>RG</div>
              <div>
                <div className="cy-display" style={{ fontSize: 18 }}>RAMÓN G.</div>
                <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)' }}>+54 11 5534 2211</div>
              </div>
            </div>
            <hr className="cy-rule" style={{ margin: '12px 0' }}/>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>RESERVAS</div>
                <div className="cy-display" style={{ fontSize: 22 }}>68</div>
              </div>
              <div>
                <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>GASTADO</div>
                <div className="cy-display" style={{ fontSize: 22 }}>$2.8M</div>
              </div>
            </div>
            <Chip fill style={{ marginTop: 10 }}>VIP · RECURRENTE</Chip>
          </div>

          <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-accent)', padding: 16 }}>
            <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em' }}>§ NOTA INTERNA</div>
            <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>
              Prefieren la C4 siempre. Llevan su propio árbitro. Piden que prendamos el reflector del lado norte.
            </div>
          </div>

          <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-paper)', padding: 16 }}>
            <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)', letterSpacing: '.14em', fontWeight: 700 }}>PARTICIPANTES · 16</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 4, marginTop: 8 }}>
              {Array.from({ length: 16 }).map((_,i) => (
                <div key={i} style={{ aspectRatio: '1', background: 'var(--cy-sand)', border: '1.5px solid var(--cy-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cy-mono)', fontSize: 10 }}>{String(i+1).padStart(2,'0')}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OwnerShell>
  );
}

// ─── 05 · ANALYTICS BEBIDAS ────────────────────────
function OwnerDrinks() {
  const top = [
    { r:1, n:'Cerveza Quilmes 1L', u:284, v:340000, cat:'CERVEZA', trend:'+28%' },
    { r:2, n:'Gatorade Naranja 500ml', u:211, v:148000, cat:'ISOTÓNICA', trend:'+14%' },
    { r:3, n:'Coca-Cola 500ml', u:198, v:118000, cat:'GASEOSA', trend:'+6%' },
    { r:4, n:'Agua Mineral 500ml', u:176, v:88000, cat:'AGUA', trend:'-2%' },
    { r:5, n:'Powerade Azul 500ml', u:142, v:98000, cat:'ISOTÓNICA', trend:'+22%' },
    { r:6, n:'Cerveza Stella 473', u:128, v:230000, cat:'CERVEZA', trend:'+8%' },
    { r:7, n:'Fernet + Coca (jarra)', u:94, v:310000, cat:'BAR', trend:'+44%' },
    { r:8, n:'Gatorade Limón 500ml', u:84, v:58000, cat:'ISOTÓNICA', trend:'—' },
  ];
  return (
    <OwnerShell page="drinks">
      <OwnerHeader
        eyebrow="ANALYTICS · MARZO 2026"
        title={<>CONSUMO<br/>DE BARRA.</>}
        right={<div style={{ display: 'flex', gap: 8 }}>
          <div className="cy-btn cy-btn-ghost" style={{ padding: '10px 14px', fontSize: 12 }}>30 DÍAS ▾</div>
          <div className="cy-btn cy-btn-accent" style={{ padding: '10px 14px', fontSize: 12 }}>EXPORTAR CSV</div>
        </div>}
      />

      {/* KPIs */}
      <div style={{ padding: '0 28px', borderBottom: '2px solid var(--cy-line)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[
            { k: 'INGRESO BARRA', v: '$1.8M', s: '22% del total', bg: 'var(--cy-accent)' },
            { k: 'UNIDADES', v: '2.847', s: '94/día promedio', bg: 'var(--cy-paper)' },
            { k: 'TICKET PROM.', v: '$4.2K', s: '2.3 items por reserva', bg: 'var(--cy-paper)' },
            { k: 'MARGEN BRUTO', v: '62%', s: '+4 pts vs feb', bg: 'var(--cy-paper)' },
          ].map((k,i) => (
            <div key={k.k} style={{ padding: '22px 20px', borderRight: i<3 ? '1.5px solid var(--cy-line)' : 'none', background: k.bg }}>
              <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.16em', color: 'var(--cy-muted)', fontWeight: 700 }}>{k.k}</div>
              <div className="cy-display" style={{ fontSize: 52, marginTop: 4 }}>{k.v}</div>
              <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)' }}>{k.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', borderBottom: '2px solid var(--cy-line)' }}>
        <div style={{ padding: 28, borderRight: '2px solid var(--cy-line)' }}>
          <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ TOP 8 · POR UNIDADES</div>
          <div className="cy-cond" style={{ fontSize: 26 }}>Ranking del mes</div>
          <hr className="cy-rule-thick" style={{ margin: '8px 0 14px' }}/>

          {top.map((d) => (
            <div key={d.r} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 80px 1fr 90px 70px', padding: '14px 0', borderBottom: '1px solid var(--cy-line)', alignItems: 'center', gap: 10 }}>
              <span className="cy-display" style={{ fontSize: 30, color: d.r <= 3 ? 'var(--cy-red)' : 'var(--cy-ink)' }}>{String(d.r).padStart(2,'0')}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{d.n}</div>
                <span className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)', letterSpacing: '.1em' }}>{d.cat}</span>
              </div>
              <span className="cy-mono" style={{ fontSize: 12, fontWeight: 700 }}>{d.u} u.</span>
              <div style={{ height: 8, background: 'var(--cy-sand)', border: '1.5px solid var(--cy-line)' }}>
                <div style={{ width: `${(d.u/284)*100}%`, height: '100%', background: d.r === 1 ? 'var(--cy-red)' : 'var(--cy-ink)' }}/>
              </div>
              <span className="cy-mono" style={{ fontSize: 12, fontWeight: 700, textAlign: 'right' }}>${(d.v/1000).toFixed(0)}K</span>
              <span className="cy-mono" style={{ fontSize: 10, color: d.trend.startsWith('+') ? 'var(--cy-red)' : 'var(--cy-muted)', fontWeight: 700, textAlign: 'right' }}>{d.trend}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: 28 }}>
          <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ POR CATEGORÍA</div>
          <div className="cy-cond" style={{ fontSize: 26 }}>Mix de barra</div>
          <hr className="cy-rule-thick" style={{ margin: '8px 0 14px' }}/>

          {/* segmented bar */}
          <div style={{ display: 'flex', height: 56, border: '1.5px solid var(--cy-line)', marginBottom: 10 }}>
            <div style={{ width: '38%', background: 'var(--cy-ink)', color: 'var(--cy-accent)', padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span className="cy-mono" style={{ fontSize: 9 }}>CERV.</span>
              <span className="cy-display" style={{ fontSize: 16 }}>38%</span>
            </div>
            <div style={{ width: '26%', background: 'var(--cy-accent)', color: 'var(--cy-ink)', padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1.5px solid var(--cy-line)' }}>
              <span className="cy-mono" style={{ fontSize: 9 }}>ISOT.</span>
              <span className="cy-display" style={{ fontSize: 16 }}>26%</span>
            </div>
            <div style={{ width: '18%', background: 'var(--cy-red)', color: 'var(--cy-paper)', padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1.5px solid var(--cy-line)' }}>
              <span className="cy-mono" style={{ fontSize: 9 }}>BAR</span>
              <span className="cy-display" style={{ fontSize: 16 }}>18%</span>
            </div>
            <div style={{ width: '12%', background: 'var(--cy-sand)', padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1.5px solid var(--cy-line)' }}>
              <span className="cy-mono" style={{ fontSize: 9 }}>GAS.</span>
              <span className="cy-display" style={{ fontSize: 16 }}>12%</span>
            </div>
            <div style={{ width: '6%', background: 'var(--cy-paper)', padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1.5px solid var(--cy-line)' }}>
              <span className="cy-mono" style={{ fontSize: 9 }}>H2O</span>
              <span className="cy-display" style={{ fontSize: 14 }}>6%</span>
            </div>
          </div>

          {/* Insight card */}
          <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-accent)', padding: 14, marginTop: 16 }}>
            <div className="cy-mono" style={{ fontSize: 9, letterSpacing: '.2em', fontWeight: 700 }}>§ INSIGHT</div>
            <div className="cy-display" style={{ fontSize: 22, marginTop: 4 }}>JUEVES = CERVEZA</div>
            <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.4 }}>
              Los jueves 21-23h concentran el <b>34% del consumo</b> de cerveza semanal. Probar packs F5+cerveza puede aumentar ticket.
            </div>
          </div>

          <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-paper)', padding: 14, marginTop: 12 }}>
            <div className="cy-mono" style={{ fontSize: 9, letterSpacing: '.2em', fontWeight: 700, color: 'var(--cy-red)' }}>⚡ REPONER</div>
            <div style={{ marginTop: 6 }}>
              {[
                { n: 'Gatorade Naranja', s: '8 u' },
                { n: 'Stella 473', s: '12 u' },
                { n: 'Coca-Cola 500ml', s: '14 u' },
              ].map((s) => (
                <div key={s.n} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--cy-line)' }}>
                  <span style={{ fontSize: 12 }}>{s.n}</span>
                  <span className="cy-mono" style={{ fontSize: 11, fontWeight: 700 }}>{s.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consumo por hora */}
      <div style={{ padding: 28 }}>
        <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ HEATMAP · CONSUMO POR HORA</div>
        <div className="cy-cond" style={{ fontSize: 26, marginBottom: 10 }}>¿Cuándo se consume más?</div>
        <hr className="cy-rule-thick" style={{ margin: 0 }}/>

        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(14,1fr)', marginTop: 14, gap: 2 }}>
          <div/>
          {['14','15','16','17','18','19','20','21','22','23','0','1','2','3'].map(h => <div key={h} className="cy-mono" style={{ fontSize: 9, textAlign: 'center', fontWeight: 700 }}>{h}h</div>)}
          {['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'].map((d, di) => (
            <React.Fragment key={d}>
              <div className="cy-mono" style={{ fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center' }}>{d}</div>
              {Array.from({ length: 14 }).map((_, hi) => {
                // deterministic pseudorandom intensity
                const base = ((di * 7 + hi * 3) % 10) / 10;
                const peak = (di >= 3 && hi >= 5 && hi <= 9) ? 1 : 0.3;
                const v = Math.min(1, base + peak * 0.8);
                const bg = v > 0.8 ? 'var(--cy-red)' : v > 0.6 ? 'var(--cy-ink)' : v > 0.35 ? 'var(--cy-accent)' : 'var(--cy-sand)';
                return <div key={hi} style={{ aspectRatio: '1', background: bg, border: '1px solid var(--cy-line)' }}/>;
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </OwnerShell>
  );
}

// ─── 06 · CONFIG ───────────────────────────────────
function OwnerSettings() {
  return (
    <OwnerShell page="settings">
      <OwnerHeader
        eyebrow="AJUSTES · NEGOCIO"
        title="CONFIG."
        right={<div className="cy-btn cy-btn-accent" style={{ padding: '10px 14px', fontSize: 12 }}>GUARDAR CAMBIOS</div>}
      />

      <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28 }}>
        {/* Sections nav */}
        <div>
          <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700, marginBottom: 8 }}>§ SECCIONES</div>
          {[
            'NEGOCIO',
            'HORARIOS',
            'POLÍTICA DE RESERVA',
            'MEDIOS DE PAGO',
            'INTEGRACIONES',
            'EQUIPO',
            'FACTURACIÓN',
          ].map((s,i) => (
            <div key={s} style={{ padding: '10px 12px', border: '1.5px solid var(--cy-line)', marginBottom: -1.5,
              background: i===0 ? 'var(--cy-ink)' : 'transparent', color: i===0 ? 'var(--cy-accent)' : 'var(--cy-ink)' }}>
              <span className="cy-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em' }}>{s}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '2px solid var(--cy-line)', background: 'var(--cy-ink)', color: 'var(--cy-accent)' }}>
              <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', fontWeight: 700 }}>§ INFORMACIÓN DEL NEGOCIO</div>
              <div className="cy-display" style={{ fontSize: 22, marginTop: 2, color: 'var(--cy-paper)' }}>LA BOMBONERITA</div>
            </div>

            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Field label="NOMBRE COMERCIAL" value="La Bombonerita"/>
              <Field label="CUIT / RUT" value="30-71234567-8" mono/>
              <Field label="TELÉFONO" value="+54 11 5534 2211" mono/>
              <Field label="EMAIL" value="reservas@bombonerita.com" mono/>
              <Field label="DIRECCIÓN" value="Av. Sarmiento 4320, Palermo" span={2}/>
              <Field label="DESCRIPCIÓN" value="Complejo deportivo con 4 canchas F5, 1 cancha F8, y 2 canchas de pádel techadas. Bar completo y vestuarios." span={2} textarea/>
            </div>

            <div style={{ padding: 20, borderTop: '1.5px solid var(--cy-line)' }}>
              <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 8 }}>DEPORTES OFRECIDOS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['FÚTBOL 5','FÚTBOL 7/8','FÚTBOL 11','PÁDEL','TENIS','BÁSQUET'].map((s,i) => (
                  <span key={s} className={[0,1,3].includes(i) ? 'cy-chip cy-chip-accent' : 'cy-chip'}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: 20, borderTop: '1.5px solid var(--cy-line)' }}>
              <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 8 }}>COMODIDADES</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  { k: 'Vestuarios', on: true },
                  { k: 'Duchas', on: true },
                  { k: 'Bar / Kiosco', on: true },
                  { k: 'Estacionamiento', on: true },
                  { k: 'Parrilla', on: false },
                  { k: 'WiFi', on: true },
                ].map((x) => (
                  <div key={x.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1.5px solid var(--cy-line)' }}>
                    <span style={{ fontSize: 12 }}>{x.k}</span>
                    <div style={{ width: 36, height: 18, background: x.on ? 'var(--cy-accent)' : 'var(--cy-sand)', border: '1.5px solid var(--cy-line)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -1, [x.on ? 'right' : 'left']: -1, width: 16, height: 18, background: 'var(--cy-ink)' }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, border: '2px solid var(--cy-line)', background: 'var(--cy-accent)', padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700 }}>§ ZONA DE PELIGRO</div>
              <div className="cy-cond" style={{ fontSize: 20, marginTop: 2 }}>Pausar el negocio en la app</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Las reservas nuevas no podrán crearse. Las reservas existentes se mantienen.</div>
            </div>
            <div className="cy-btn cy-btn-ghost" style={{ padding: '10px 14px', fontSize: 11, background: 'var(--cy-ink)', color: 'var(--cy-paper)' }}>PAUSAR</div>
          </div>
        </div>
      </div>
    </OwnerShell>
  );
}

function Field({ label, value, mono, span, textarea }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : 'auto' }}>
      <div className="cy-mono" style={{ fontSize: 9, letterSpacing: '.14em', fontWeight: 700, color: 'var(--cy-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ border: '1.5px solid var(--cy-line)', padding: textarea ? 10 : '8px 10px', background: 'var(--cy-bg)',
        fontFamily: mono ? 'var(--cy-mono)' : 'var(--cy-ui)', fontSize: mono ? 12 : 13,
        minHeight: textarea ? 60 : 'auto' }}>{value}</div>
    </div>
  );
}

Object.assign(window, {
  OwnerDashboard, OwnerCalendar, OwnerCourts, OwnerBookingDetail, OwnerDrinks, OwnerSettings,
});
