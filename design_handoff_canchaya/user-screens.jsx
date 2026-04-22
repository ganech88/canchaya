// CanchaYa — User mobile screens (Android)
// Editorial sports magazine aesthetic

const COURTS = [
  { id: 1, name: 'LA BOMBONERITA', zone: 'Palermo · 1.2km', type: 'Fútbol 5', price: 18000, rating: 4.9, reviews: 284, open: true, tag: 'HOT', color: 'field' },
  { id: 2, name: 'PÁDEL CLUB SUR', zone: 'Caballito · 2.4km', type: 'Pádel', price: 9500, rating: 4.7, reviews: 142, open: true, tag: null, color: 'accent' },
  { id: 3, name: 'EL POTRERO', zone: 'Villa Crespo · 0.8km', type: 'Fútbol 8', price: 26000, rating: 4.8, reviews: 398, open: false, tag: 'NEW', color: 'dark' },
  { id: 4, name: 'ROJA COURT', zone: 'Belgrano · 3.1km', type: 'Pádel', price: 11000, rating: 4.6, reviews: 87, open: true, tag: null, color: 'field' },
];

// ─── 01 · HOME / DESCUBRIMIENTO ─────────────────────────
function ScreenHome() {
  return (
    <div className="cy-root" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cy-bg)' }}>
      <MastheadMobile dateStr="MAR·22·2026" issue="ED. MATUTINA" />

      {/* Hero title */}
      <div style={{ padding: '16px 16px 10px' }}>
        <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700, marginBottom: 6 }}>§ HOY · PALERMO</div>
        <div className="cy-display" style={{ fontSize: 54, color: 'var(--cy-ink)' }}>JUGÁ<br/>CERCA.</div>
        <div style={{ fontSize: 13, color: 'var(--cy-muted)', marginTop: 6, maxWidth: 280 }}>
          12 canchas disponibles en los próximos 90 minutos a menos de 3 km.
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '6px 16px 14px' }}>
        <div style={{ display: 'flex', border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
          <div style={{ padding: '12px', display: 'flex', alignItems: 'center', borderRight: '1.5px solid var(--cy-line)' }}><Icon.search/></div>
          <div style={{ flex: 1, padding: '12px 10px', fontSize: 13, color: 'var(--cy-muted)' }}>Buscar cancha, zona, club…</div>
          <div style={{ padding: '12px', display: 'flex', alignItems: 'center', background: 'var(--cy-ink)', color: 'var(--cy-accent)' }}><Icon.filter/></div>
        </div>
      </div>

      {/* Category rail */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, overflowX: 'auto' }} className="cy-no-scroll">
        {['TODO','FÚTBOL 5','FÚTBOL 8','FÚTBOL 11','PÁDEL','TENIS'].map((c,i) => (
          <span key={c} className={i===0 ? 'cy-chip cy-chip-fill' : 'cy-chip'} style={{ whiteSpace:'nowrap' }}>{c}</span>
        ))}
      </div>

      {/* Featured card */}
      <div style={{ padding: '0 16px 14px' }}>
        <FeaturedCard court={COURTS[0]} />
      </div>

      {/* "El partido abierto" promo */}
      <div style={{ margin: '0 16px 14px', border: '2px solid var(--cy-line)', background: 'var(--cy-accent)', display: 'flex', alignItems: 'stretch' }}>
        <div style={{ padding: '12px 14px', flex: 1 }}>
          <div className="cy-mono" style={{ fontSize: 9, letterSpacing: '.2em', fontWeight: 700 }}>§ PARTIDO ABIERTO</div>
          <div className="cy-display" style={{ fontSize: 22, marginTop: 4 }}>FALTAN<br/>2 JUGADORES</div>
          <div style={{ fontSize: 11, marginTop: 6, color: 'var(--cy-ink)' }}>F5 · El Potrero · Hoy 21:00</div>
        </div>
        <div style={{ width: 72, background: 'var(--cy-ink)', color: 'var(--cy-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.arrow style={{ width: 28, height: 28 }}/>
        </div>
      </div>

      {/* Nearby list */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 10 }}>
          <div className="cy-cond" style={{ fontSize: 22 }}>Cerca tuyo</div>
          <span className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)' }}>VER MAPA →</span>
        </div>
        <hr className="cy-rule-thick" style={{ margin: 0, marginBottom: 10 }}/>
        {COURTS.slice(1,4).map((c) => <CourtRow key={c.id} court={c}/>)}
      </div>

      <div style={{ flex: 1 }}/>
      <BottomNav active="home"/>
    </div>
  );
}

function FeaturedCard({ court }) {
  return (
    <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
      <div className={`cy-img-placeholder ${court.color}`} style={{ height: 160, borderLeft: 0, borderRight: 0, borderTop: 0, position: 'relative' }}>
        <span>CANCHA · PHOTO</span>
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 6 }}>
          <Chip accent>★ DESTACADA</Chip>
          {court.tag && <Chip fill>{court.tag}</Chip>}
        </div>
        <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
          <Chip fill>DISPONIBLE · 20:30</Chip>
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems: 'baseline', gap: 8 }}>
          <div className="cy-display" style={{ fontSize: 22 }}>{court.name}</div>
          <Rating value={court.rating} count={court.reviews}/>
        </div>
        <div style={{ display:'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <CourtType type={court.type}/>
          <span className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)', alignSelf:'center' }}>· {court.zone}</span>
        </div>
        <hr className="cy-rule" style={{ margin: '10px 0' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems: 'center' }}>
          <div>
            <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>DESDE / HORA</div>
            <div className="cy-display" style={{ fontSize: 20 }}>${(court.price/1000).toFixed(1)}K</div>
          </div>
          <div className="cy-btn cy-btn-accent" style={{ padding: '10px 14px', fontSize: 12 }}>RESERVAR <Icon.arrow/></div>
        </div>
      </div>
    </div>
  );
}

function CourtRow({ court }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--cy-line)' }}>
      <div className={`cy-img-placeholder ${court.color}`} style={{ width: 68, height: 68, flexShrink: 0, fontSize: 8 }}>IMG</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', gap: 6 }}>
          <div className="cy-display" style={{ fontSize: 15, color: 'var(--cy-ink)' }}>{court.name}</div>
          <Rating value={court.rating} count={court.reviews}/>
        </div>
        <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)', marginTop: 2 }}>{court.zone}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 6 }}>
          <CourtType type={court.type}/>
          <span className="cy-display" style={{ fontSize: 14 }}>${(court.price/1000).toFixed(1)}K<span className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)', marginLeft: 3 }}>/HR</span></span>
        </div>
      </div>
    </div>
  );
}

// ─── 02 · BÚSQUEDA / FILTROS ────────────────────────────
function ScreenSearch() {
  return (
    <div className="cy-root" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cy-bg)' }}>
      {/* Header with back */}
      <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
        <Icon.back/>
        <div style={{ flex: 1, border: '1.5px solid var(--cy-line)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.search/>
          <span style={{ fontSize: 13 }}>pádel palermo</span>
          <span style={{ marginLeft: 'auto' }}><Icon.close/></span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '12px 16px', borderBottom: '1.5px solid var(--cy-line)' }}>
        <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700, marginBottom: 10 }}>§ FILTROS</div>

        <div style={{ marginBottom: 14 }}>
          <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>DEPORTE</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['F5','F7/8','F11','PÁDEL','TENIS'].map((c,i) => (
              <span key={c} className={i===3 ? 'cy-chip cy-chip-accent' : 'cy-chip'}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
            <span className="cy-mono" style={{ fontSize: 10, fontWeight: 700 }}>PRECIO · HORA</span>
            <span className="cy-mono" style={{ fontSize: 10 }}>$4K — $18K</span>
          </div>
          <div style={{ height: 8, background: 'var(--cy-paper)', border: '1.5px solid var(--cy-line)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '15%', right: '35%', top: -1.5, bottom: -1.5, background: 'var(--cy-accent)', borderLeft: '1.5px solid var(--cy-line)', borderRight: '1.5px solid var(--cy-line)' }}/>
            <div style={{ position: 'absolute', left: '15%', top: -5, width: 10, height: 16, background: 'var(--cy-ink)', transform: 'translateX(-50%)' }}/>
            <div style={{ position: 'absolute', left: '65%', top: -5, width: 10, height: 16, background: 'var(--cy-ink)', transform: 'translateX(-50%)' }}/>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>HORARIO · HOY</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
            {['18','19','20','21','22','23'].slice(0,5).map((h,i) => (
              <div key={h} style={{ padding: '8px 0', textAlign: 'center', border: '1.5px solid var(--cy-line)',
                background: i===1 ? 'var(--cy-ink)' : 'var(--cy-paper)', color: i===1 ? 'var(--cy-accent)' : 'var(--cy-ink)',
                fontFamily: 'var(--cy-display)', fontSize: 16 }}>{h}h</div>
            ))}
          </div>
        </div>

        <div>
          <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>EXTRAS</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['TECHADA','VESTUARIO','BAR','ESTAC.','PROFE'].map((e,i) => (
              <span key={e} className={[0,2].includes(i) ? 'cy-chip cy-chip-fill' : 'cy-chip'}>{e}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span className="cy-display" style={{ fontSize: 28 }}>07</span>
          <span className="cy-cond" style={{ fontSize: 16, marginLeft: 8 }}>Canchas</span>
        </div>
        <span className="cy-mono" style={{ fontSize: 10 }}>ORDEN · CERCANÍA ▾</span>
      </div>

      <div style={{ padding: '0 16px', flex: 1, overflow: 'hidden' }}>
        {COURTS.slice(1,4).map((c) => <CourtRow key={c.id} court={c}/>)}
      </div>

      {/* Sticky bottom */}
      <div style={{ padding: '12px 16px', borderTop: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
        <div className="cy-btn cy-btn-accent" style={{ width: '100%' }}>
          VER EN MAPA <Icon.arrow/>
        </div>
      </div>
    </div>
  );
}

// ─── 03 · MAPA ─────────────────────────────────────────
function ScreenMap() {
  return (
    <div className="cy-root" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cy-bg)', position: 'relative' }}>
      {/* Map placeholder */}
      <div style={{ flex: 1, position: 'relative',
        background: 'var(--cy-field)',
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, transparent 1px 80px), repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 80px)'
      }}>
        {/* Top search bar overlay */}
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, border: '2px solid var(--cy-line)', background: 'var(--cy-paper)', display: 'flex' }}>
          <div style={{ padding: '10px 12px', borderRight: '1.5px solid var(--cy-line)' }}><Icon.back/></div>
          <div style={{ flex: 1, padding: '10px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon.mapPin/>
            <span>Palermo, CABA</span>
          </div>
          <div style={{ padding: '10px 12px', background: 'var(--cy-ink)', color: 'var(--cy-accent)' }}><Icon.filter/></div>
        </div>

        {/* Map "roads" */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }} viewBox="0 0 400 600" preserveAspectRatio="none">
          <path d="M-20 180 Q 180 140 450 260" stroke="#fff" strokeWidth="6" fill="none"/>
          <path d="M80 -20 Q 120 240 200 620" stroke="#fff" strokeWidth="5" fill="none"/>
          <path d="M-20 430 Q 220 380 450 450" stroke="#fff" strokeWidth="4" fill="none"/>
          <path d="M280 -20 Q 260 300 340 620" stroke="#fff" strokeWidth="3" fill="none"/>
        </svg>

        {/* Pins */}
        <MapPin left="28%" top="24%" price="18" active/>
        <MapPin left="62%" top="36%" price="9.5" />
        <MapPin left="44%" top="54%" price="26" hot/>
        <MapPin left="74%" top="58%" price="11" />
        <MapPin left="22%" top="68%" price="14" />

        {/* User dot */}
        <div style={{ position: 'absolute', left: '50%', top: '48%', width: 18, height: 18, borderRadius: '50%', background: 'var(--cy-accent)', border: '3px solid var(--cy-ink)', transform: 'translate(-50%,-50%)', boxShadow: '0 0 0 10px rgba(198,255,26,.2)' }}/>

        {/* Recenter FAB */}
        <div style={{ position: 'absolute', bottom: 200, right: 14, width: 42, height: 42, background: 'var(--cy-paper)', border: '2px solid var(--cy-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.mapPin style={{ width: 18, height: 18 }}/>
        </div>
      </div>

      {/* Bottom sheet preview */}
      <div style={{ background: 'var(--cy-paper)', borderTop: '2px solid var(--cy-line)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <div style={{ width: 40, height: 3, background: 'var(--cy-line)' }}/>
        </div>
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="cy-img-placeholder field" style={{ width: 84, height: 84, flexShrink: 0, fontSize: 8 }}>IMG</div>
            <div style={{ flex: 1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <div className="cy-display" style={{ fontSize: 18 }}>LA BOMBONERITA</div>
                <Chip fill>20:30</Chip>
              </div>
              <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)', marginTop: 2 }}>Palermo · 1.2 km · F5 techada</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                <Rating value={4.9} count={284}/>
                <span className="cy-display" style={{ fontSize: 16, marginLeft: 'auto' }}>$18K</span>
              </div>
            </div>
          </div>
          <div className="cy-btn cy-btn-accent" style={{ width: '100%', marginTop: 10 }}>VER DETALLE <Icon.arrow/></div>
        </div>
      </div>

      <BottomNav active="map"/>
    </div>
  );
}

function MapPin({ left, top, price, active, hot }) {
  return (
    <div style={{ position: 'absolute', left, top, transform: 'translate(-50%,-100%)' }}>
      <div style={{
        background: active ? 'var(--cy-accent)' : (hot ? 'var(--cy-red)' : 'var(--cy-paper)'),
        color: active || hot ? 'var(--cy-ink)' : 'var(--cy-ink)',
        border: '2px solid var(--cy-line)',
        padding: '5px 8px',
        fontFamily: 'var(--cy-display)', fontSize: 14,
        position: 'relative',
      }}>
        ${price}K
        <div style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid var(--cy-line)' }}/>
      </div>
    </div>
  );
}

// ─── 04 · DETALLE + CALENDARIO ─────────────────────────
function ScreenDetail() {
  const hours = ['16','17','18','19','20','21','22','23'];
  const busy = { '17': true, '19': true, '22': true };
  const picked = '20';

  return (
    <div className="cy-root" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cy-bg)', overflow: 'auto' }} className="cy-no-scroll">
      {/* Hero image */}
      <div className="cy-img-placeholder field" style={{ height: 200, borderLeft: 0, borderRight: 0, borderTop: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--cy-paper)', border: '2px solid var(--cy-line)', padding: 6 }}>
          <Icon.back/>
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
          <div style={{ background: 'var(--cy-paper)', border: '2px solid var(--cy-line)', padding: 6 }}><Icon.heart/></div>
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 6 }}>
          <Chip fill>1 / 6</Chip>
          <Chip accent>F5 · TECHADA</Chip>
        </div>
      </div>

      {/* Title block */}
      <div style={{ padding: '16px 16px 8px', background: 'var(--cy-paper)', borderBottom: '2px solid var(--cy-line)' }}>
        <div className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ FICHA · N°074</div>
        <div className="cy-display" style={{ fontSize: 40, marginTop: 4 }}>LA BOMBO-<br/>NERITA</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
          <Rating value={4.9} count={284}/>
          <span className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)' }}>·</span>
          <span className="cy-mono" style={{ fontSize: 10 }}>PALERMO · 1.2 KM</span>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '2px solid var(--cy-line)' }}>
        {[
          { k: 'CANCHAS', v: '04' },
          { k: 'ABIERTO', v: '24/7' },
          { k: 'PISO', v: 'SINT.' },
        ].map((s,i) => (
          <div key={s.k} style={{ padding: '10px 12px', borderRight: i < 2 ? '1.5px solid var(--cy-line)' : 'none', background: 'var(--cy-paper)' }}>
            <div className="cy-display" style={{ fontSize: 20 }}>{s.v}</div>
            <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)', letterSpacing: '.14em' }}>{s.k}</div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
          <div className="cy-cond" style={{ fontSize: 22 }}>Turnos · Mar 22</div>
          <span className="cy-mono" style={{ fontSize: 10 }}>◀ HOY ▶</span>
        </div>
        <hr className="cy-rule-thick" style={{ margin: 0 }}/>
        {/* Day strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 10 }}>
          {['L','M','X','J','V','S','D'].map((d, i) => (
            <div key={i} style={{
              border: '1.5px solid var(--cy-line)', padding: '6px 0', textAlign: 'center',
              background: i===2 ? 'var(--cy-accent)' : 'var(--cy-paper)',
            }}>
              <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>{d}</div>
              <div className="cy-display" style={{ fontSize: 16 }}>{20+i}</div>
            </div>
          ))}
        </div>
        {/* Hour grid */}
        <div className="cy-mono" style={{ fontSize: 10, marginTop: 14, marginBottom: 6, color: 'var(--cy-muted)' }}>DISPONIBILIDAD</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {hours.map((h) => {
            const isBusy = busy[h]; const isPicked = h === picked;
            return (
              <div key={h} style={{
                padding: '10px 0', textAlign: 'center',
                border: '1.5px solid var(--cy-line)',
                background: isPicked ? 'var(--cy-ink)' : (isBusy ? 'var(--cy-sand)' : 'var(--cy-paper)'),
                color: isPicked ? 'var(--cy-accent)' : (isBusy ? 'var(--cy-muted)' : 'var(--cy-ink)'),
                textDecoration: isBusy ? 'line-through' : 'none',
                fontFamily: 'var(--cy-display)', fontSize: 18, position: 'relative',
              }}>{h}:00
                {isPicked && <div style={{ position: 'absolute', top: -6, right: -6, background: 'var(--cy-accent)', border: '1.5px solid var(--cy-line)', padding: '1px 4px', fontSize: 9, fontFamily: 'var(--cy-mono)' }}>OK</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price break */}
      <div style={{ margin: '0 16px 14px', border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', padding: '10px 12px', borderBottom: '1.5px solid var(--cy-line)' }}>
          <span className="cy-mono" style={{ fontSize: 11 }}>Cancha · 1 h · 20:00</span>
          <span className="cy-mono" style={{ fontSize: 11 }}>$18.000</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', padding: '10px 12px', borderBottom: '1.5px solid var(--cy-line)' }}>
          <span className="cy-mono" style={{ fontSize: 11 }}>Alquiler pelota</span>
          <span className="cy-mono" style={{ fontSize: 11 }}>$800</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', padding: '12px', background: 'var(--cy-ink)', color: 'var(--cy-accent)' }}>
          <span className="cy-display" style={{ fontSize: 18 }}>TOTAL</span>
          <span className="cy-display" style={{ fontSize: 24 }}>$18.800</span>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div className="cy-btn cy-btn-accent" style={{ width: '100%' }}>RESERVAR Y PAGAR <Icon.arrow/></div>
      </div>
    </div>
  );
}

// ─── 05 · PARTIDO ABIERTO (crear) ──────────────────────
function ScreenOpenMatch() {
  return (
    <div className="cy-root" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cy-bg)' }}>
      <MastheadMobile section="PARTIDO ABIERTO" title="FALTAN." sub="Publicá tu convocatoria. Los que estén cerca la verán."/>

      <div style={{ padding: '14px 16px 10px' }}>
        <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>CANCHA RESERVADA</div>
        <div style={{ border: '2px solid var(--cy-line)', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--cy-paper)' }}>
          <div>
            <div className="cy-display" style={{ fontSize: 16 }}>EL POTRERO · F5</div>
            <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)' }}>HOY · 21:00 · 1 H</div>
          </div>
          <Chip accent>OK</Chip>
        </div>
      </div>

      <div style={{ padding: '8px 16px 10px' }}>
        <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>JUGADORES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
          {[1,2,3,4,5,6,7,8,9,10].map((i) => {
            const filled = i <= 8;
            const isMe = i === 1;
            return (
              <div key={i} style={{
                aspectRatio: '1', border: '1.5px solid var(--cy-line)',
                background: isMe ? 'var(--cy-ink)' : (filled ? 'var(--cy-sand)' : 'var(--cy-paper)'),
                color: isMe ? 'var(--cy-accent)' : 'var(--cy-ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--cy-display)', fontSize: 18, position: 'relative',
              }}>
                {isMe ? 'YO' : (filled ? String(i).padStart(2,'0') : '+')}
                {!filled && <div className="cy-mono" style={{ position: 'absolute', bottom: 2, fontSize: 7, color: 'var(--cy-red)' }}>FALTA</div>}
              </div>
            );
          })}
        </div>
        <div className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)', marginTop: 8 }}>
          8 / 10 confirmados — <span style={{ color: 'var(--cy-red)', fontWeight: 700 }}>FALTAN 2</span>
        </div>
      </div>

      <div style={{ padding: '0 16px 10px' }}>
        <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>NIVEL · ABIERTO A</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['PRINCIPIANTE','INTERMEDIO','AVANZADO'].map((n,i) => (
            <span key={n} className={i===1 ? 'cy-chip cy-chip-accent' : 'cy-chip'}>{n}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '4px 16px 10px' }}>
        <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>APORTE / JUGADOR</div>
        <div style={{ border: '2px solid var(--cy-line)', padding: '10px 12px', background: 'var(--cy-paper)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="cy-display" style={{ fontSize: 26 }}>$2.600</span>
          <span className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)' }}>$26K ÷ 10</span>
        </div>
      </div>

      <div style={{ padding: '8px 16px 10px', marginTop: 'auto' }}>
        <div style={{ border: '2px solid var(--cy-line)', background: 'var(--cy-accent)', padding: '10px 12px' }}>
          <div className="cy-mono" style={{ fontSize: 10, fontWeight: 700 }}>ALCANCE ESTIMADO</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
            <span className="cy-display" style={{ fontSize: 34 }}>340</span>
            <span className="cy-mono" style={{ fontSize: 10 }}>jugadores a &lt;3km verán tu convocatoria</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div className="cy-btn cy-btn-accent" style={{ width: '100%' }}>PUBLICAR CONVOCATORIA <Icon.arrow/></div>
      </div>
    </div>
  );
}

// ─── 06 · POPUP (unirse a partido) ─────────────────────
function ScreenPopup() {
  return (
    <div className="cy-root" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cy-bg)', position: 'relative' }}>
      {/* Faded home behind */}
      <div style={{ padding: '12px 16px', opacity: 0.4, filter: 'blur(0.5px)', pointerEvents: 'none' }}>
        <MastheadMobile dateStr="MAR·22·2026" issue="ED. MATUTINA" />
        <div style={{ padding: 12 }}>
          <div className="cy-display" style={{ fontSize: 40 }}>JUGÁ<br/>CERCA.</div>
        </div>
        <div className="cy-img-placeholder field" style={{ height: 120 }}>IMG</div>
      </div>

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.55)' }}/>

      {/* Notification pop */}
      <div style={{ position: 'absolute', left: 12, right: 12, top: 46, border: '2px solid var(--cy-line)', background: 'var(--cy-accent)', padding: '10px 12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <Icon.bolt/>
          <span className="cy-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em' }}>PARTIDO CERCA · 0.8 KM</span>
        </div>
        <div className="cy-display" style={{ fontSize: 20, marginTop: 4 }}>¿TE SUMÁS?</div>
      </div>

      {/* Dialog */}
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, border: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--cy-ink)', color: 'var(--cy-accent)' }}>
          <span className="cy-mono" style={{ fontSize: 10, letterSpacing: '.14em', fontWeight: 700 }}>§ CONVOCATORIA · URGENTE</span>
          <Icon.close style={{ color: 'var(--cy-accent)' }}/>
        </div>

        {/* Hero */}
        <div className="cy-img-placeholder field" style={{ height: 90, border: 'none', borderBottom: '1.5px solid var(--cy-line)', fontSize: 9 }}>EL POTRERO · F5</div>

        <div style={{ padding: '10px 12px' }}>
          <div className="cy-display" style={{ fontSize: 28, lineHeight: 0.9 }}>FALTAN<br/>DOS.</div>
          <div className="cy-mono" style={{ fontSize: 11, color: 'var(--cy-muted)', marginTop: 6 }}>
            Partido armado por <b style={{ color: 'var(--cy-ink)' }}>Martín</b> · Hoy 21:00 · Nivel intermedio
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', marginTop: 10, border: '1.5px solid var(--cy-line)' }}>
            <div style={{ padding: 8, borderRight: '1.5px solid var(--cy-line)' }}>
              <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>APORTE</div>
              <div className="cy-display" style={{ fontSize: 18 }}>$2.6K</div>
            </div>
            <div style={{ padding: 8, borderRight: '1.5px solid var(--cy-line)' }}>
              <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>DISTANCIA</div>
              <div className="cy-display" style={{ fontSize: 18 }}>0.8K</div>
            </div>
            <div style={{ padding: 8 }}>
              <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>JUGADORES</div>
              <div className="cy-display" style={{ fontSize: 18 }}>8/10</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <div className="cy-btn cy-btn-ghost" style={{ flex: 1, fontSize: 12, padding: '10px 12px' }}>AHORA NO</div>
            <div className="cy-btn cy-btn-accent" style={{ flex: 2, fontSize: 12, padding: '10px 12px' }}>ME SUMO <Icon.arrow/></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 07 · PERFIL ───────────────────────────────────────
function ScreenProfile() {
  return (
    <div className="cy-root" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cy-bg)' }}>
      <MastheadMobile section="PERFIL · JUGADOR" />

      {/* Identity card */}
      <div style={{ padding: '14px 16px 10px', background: 'var(--cy-paper)', borderBottom: '2px solid var(--cy-line)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div className="cy-img-placeholder accent" style={{ width: 80, height: 80, fontSize: 8 }}>AVA</div>
          <div>
            <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>N°0284 · DESDE 2023</div>
            <div className="cy-display" style={{ fontSize: 26 }}>MARTÍN B.</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <Chip fill>MVP · MAR</Chip>
              <Chip>NIV. 7</Chip>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '2px solid var(--cy-line)' }}>
        {[
          { k: 'PARTIDOS', v: '48' },
          { k: 'GOLES', v: '37' },
          { k: 'RATING', v: '4.8' },
        ].map((s,i) => (
          <div key={s.k} style={{ padding: '14px 12px', borderRight: i<2 ? '1.5px solid var(--cy-line)' : 'none', background: i===1 ? 'var(--cy-accent)' : 'var(--cy-paper)' }}>
            <div className="cy-display" style={{ fontSize: 34 }}>{s.v}</div>
            <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)', letterSpacing: '.14em' }}>{s.k}</div>
          </div>
        ))}
      </div>

      {/* Sport breakdown */}
      <div style={{ padding: '14px 16px 10px' }}>
        <div className="cy-cond" style={{ fontSize: 22, marginBottom: 8 }}>Por deporte</div>
        <hr className="cy-rule-thick" style={{ margin: 0 }}/>
        {[
          { s: 'Fútbol 5', n: 34, pct: 72 },
          { s: 'Pádel',    n: 11, pct: 23 },
          { s: 'Fútbol 8', n: 3,  pct: 5 },
        ].map((r) => (
          <div key={r.s} style={{ padding: '10px 0', borderBottom: '1px solid var(--cy-line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="cy-cond" style={{ fontSize: 18 }}>{r.s}</span>
              <span className="cy-mono" style={{ fontSize: 11 }}>{r.n} partidos · {r.pct}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--cy-sand)', border: '1.5px solid var(--cy-line)', marginTop: 4 }}>
              <div style={{ width: `${r.pct}%`, height: '100%', background: 'var(--cy-ink)' }}/>
            </div>
          </div>
        ))}
      </div>

      {/* History */}
      <div style={{ padding: '14px 16px' }}>
        <div className="cy-cond" style={{ fontSize: 22, marginBottom: 8 }}>Historial</div>
        <hr className="cy-rule-thick" style={{ margin: 0 }}/>
        {[
          { d: 'SAB 20', t: 'La Bombonerita · F5', r: 'GANADO · 7-4' },
          { d: 'MIE 17', t: 'Pádel Club Sur', r: 'PERDIDO · 4-6 / 3-6' },
          { d: 'DOM 14', t: 'El Potrero · F8', r: 'GANADO · 9-6' },
        ].map((h,i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--cy-line)' }}>
            <div style={{ width: 44, flexShrink: 0 }}>
              <div className="cy-display" style={{ fontSize: 16 }}>{h.d.split(' ')[1]}</div>
              <div className="cy-mono" style={{ fontSize: 9, color: 'var(--cy-muted)' }}>{h.d.split(' ')[0]}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="cy-cond" style={{ fontSize: 15 }}>{h.t}</div>
              <div className="cy-mono" style={{ fontSize: 10, color: h.r.startsWith('G') ? 'var(--cy-ink)' : 'var(--cy-muted)' }}>{h.r}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}/>
      <BottomNav active="me"/>
    </div>
  );
}

// ─── 08 · CHAT DEL PARTIDO ─────────────────────────────
function ScreenChat() {
  return (
    <div className="cy-root" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--cy-bg)' }}>
      {/* Chat header */}
      <div style={{ padding: '12px 14px', borderBottom: '2px solid var(--cy-line)', background: 'var(--cy-ink)', color: 'var(--cy-accent)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon.back style={{ color: 'var(--cy-accent)' }}/>
        <div style={{ flex: 1 }}>
          <div className="cy-mono" style={{ fontSize: 9, letterSpacing: '.14em', opacity: 0.7 }}>§ PARTIDO · HOY 21:00</div>
          <div className="cy-display" style={{ fontSize: 16, color: 'var(--cy-accent)' }}>EL POTRERO · F5</div>
        </div>
        <Chip accent>8/10</Chip>
      </div>

      {/* Pinned info */}
      <div style={{ padding: '10px 14px', background: 'var(--cy-accent)', borderBottom: '2px solid var(--cy-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="cy-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em' }}>📍 UBICACIÓN · APORTE</div>
          <div className="cy-mono" style={{ fontSize: 11, marginTop: 2 }}>Sarmiento 4320 · $2.6K p/u</div>
        </div>
        <span className="cy-mono" style={{ fontSize: 10, fontWeight: 700 }}>VER ▸</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <DayDivider>HOY · 14:22</DayDivider>
        <Msg from="MARTÍN" color="var(--cy-ink)" text="Gente, ¿llevo alguna pelota de repuesto?" side="other"/>
        <Msg from="LUCAS" color="var(--cy-red)" text="Dale, yo llevo la otra. Nos vemos 20:45 en la entrada." side="other"/>
        <Msg from="TÚ" text="Perfecto. Alguien pasa por Palermo a las 20:15?" side="me"/>

        <DayDivider>17:40</DayDivider>
        <MsgSystem>JUAN se unió al partido · FALTA 1</MsgSystem>
        <Msg from="JUAN" color="var(--cy-field)" text="Ya estoy! Vengo de Caballito, llego a horario." side="other"/>
        <Msg from="TÚ" text="Bárbaro. ¿Alguien trae algo para tomar?" side="me"/>
        <MsgSystem>💸 5 pagos recibidos · $13.000 / $26.000</MsgSystem>
      </div>

      {/* Input */}
      <div style={{ padding: 10, borderTop: '2px solid var(--cy-line)', background: 'var(--cy-paper)', display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, border: '1.5px solid var(--cy-line)', padding: '10px 12px', fontSize: 13, color: 'var(--cy-muted)' }}>Escribí algo…</div>
        <div style={{ background: 'var(--cy-ink)', color: 'var(--cy-accent)', padding: '10px 14px', border: '1.5px solid var(--cy-line)' }}><Icon.arrow/></div>
      </div>
    </div>
  );
}

function Msg({ from, text, side, color = 'var(--cy-ink)' }) {
  const isMe = side === 'me';
  return (
    <div style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
      {!isMe && <div className="cy-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', marginBottom: 2, color }}>{from}</div>}
      <div style={{
        border: '1.5px solid var(--cy-line)',
        padding: '8px 10px',
        fontSize: 13,
        background: isMe ? 'var(--cy-ink)' : 'var(--cy-paper)',
        color: isMe ? 'var(--cy-accent)' : 'var(--cy-ink)',
      }}>{text}</div>
    </div>
  );
}

function MsgSystem({ children }) {
  return <div style={{ alignSelf: 'center', fontFamily: 'var(--cy-mono)', fontSize: 10, color: 'var(--cy-muted)', letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 10px', border: '1.5px dashed var(--cy-line)' }}>{children}</div>;
}

function DayDivider({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 0' }}>
      <div style={{ flex: 1, borderTop: '1.5px solid var(--cy-line)' }}/>
      <span className="cy-mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--cy-muted)' }}>{children}</span>
      <div style={{ flex: 1, borderTop: '1.5px solid var(--cy-line)' }}/>
    </div>
  );
}

Object.assign(window, {
  ScreenHome, ScreenSearch, ScreenMap, ScreenDetail,
  ScreenOpenMatch, ScreenPopup, ScreenProfile, ScreenChat,
});
