// Shared UI primitives for CanchaYa
// Editorial sports magazine aesthetic

const { useState, useRef, useEffect, useMemo } = React;

// ─── Icons (minimal inline SVGs) ───────────────────────
const Icon = {
  search: (p) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="7" cy="7" r="5"/><path d="M11 11l4 4"/></svg>,
  mapPin: (p) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M8 14s5-4.5 5-8.5a5 5 0 00-10 0C3 9.5 8 14 8 14z"/><circle cx="8" cy="5.5" r="1.8"/></svg>,
  clock: (p) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="8" cy="8" r="6.5"/><path d="M8 4.5V8l2.5 2"/></svg>,
  arrow: (p) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" {...p}><path d="M3 8h10M9 4l4 4-4 4"/></svg>,
  chev: (p) => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M4 2l4 4-4 4"/></svg>,
  bolt: (p) => <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" {...p}><path d="M7 0L2 7h3l-1 5 5-7H6l1-5z"/></svg>,
  plus: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}><path d="M7 2v10M2 7h10"/></svg>,
  filter: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M1 3h12M3 7h8M5 11h4"/></svg>,
  star: (p) => <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" {...p}><path d="M6 0.5l1.6 3.4 3.7.4-2.8 2.6.8 3.6L6 8.8 2.7 10.5l.8-3.6L.7 4.3l3.7-.4L6 .5z"/></svg>,
  dot: (p) => <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" {...p}><circle cx="3" cy="3" r="3"/></svg>,
  ball: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="7" cy="7" r="6"/><path d="M7 1l2.3 3L7 5l-2.3-1L7 1zM1 7l3-1 1 2-2 2L1 7zm12 0l-2 3-2-2 1-2 3 1zM5 12l1-3h2l1 3-2 1-2-1z"/></svg>,
  padel: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}><circle cx="7" cy="5" r="4"/><path d="M7 9v4M5 13h4"/><circle cx="5.5" cy="4" r=".5" fill="currentColor"/><circle cx="8" cy="3.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="6" r=".5" fill="currentColor"/><circle cx="5.5" cy="6.5" r=".5" fill="currentColor"/></svg>,
  back: (p) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}><path d="M11 3L5 9l6 6"/></svg>,
  heart: (p) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M8 14s-5.5-3.5-5.5-7.5A3 3 0 018 4.5 3 3 0 0113.5 6.5C13.5 10.5 8 14 8 14z"/></svg>,
  home: (p) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M3 8l6-5 6 5v7H3V8z"/></svg>,
  map: (p) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M1 4l5-2 6 2 5-2v12l-5 2-6-2-5 2V4zM6 2v12M12 4v12"/></svg>,
  user: (p) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="9" cy="6" r="3"/><path d="M2 16c1-3.5 4-5 7-5s6 1.5 7 5"/></svg>,
  chat: (p) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M2 4h14v9H7l-4 3v-3H2V4z"/></svg>,
  close: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" {...p}><path d="M2 2l10 10M12 2L2 12"/></svg>,
  menu: (p) => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M2 5h14M2 9h14M2 13h14"/></svg>,
  trend: (p) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M1 12l5-5 3 3 6-7M10 3h5v5"/></svg>,
};

// ─── Chip ───────────────────────────────────────────────
function Chip({ children, fill, accent, style }) {
  const cls = 'cy-chip' + (fill ? ' cy-chip-fill' : '') + (accent ? ' cy-chip-accent' : '');
  return <span className={cls} style={style}>{children}</span>;
}

// ─── Editorial header strip (magazine masthead style) ──
function MastheadMobile({ dateStr = 'MAR·22·2026', issue = 'ISSUE #074', section, title, sub }) {
  return (
    <div style={{ borderBottom: '2px solid var(--cy-line)', background: 'var(--cy-paper)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid var(--cy-line)' }}>
        <span className="cy-mono" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase' }}>{dateStr}</span>
        <span className="cy-mono" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase' }}>{issue}</span>
      </div>
      {section && (
        <div style={{ padding: '10px 16px 4px', display:'flex', alignItems:'baseline', gap: 10 }}>
          <span className="cy-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--cy-red)', fontWeight: 700 }}>§ {section}</span>
          <span style={{ flex: 1, borderTop: '1.5px solid var(--cy-line)', marginLeft: 6 }} />
        </div>
      )}
      {title && <div className="cy-display" style={{ fontSize: 40, padding: '4px 16px 2px', color: 'var(--cy-ink)' }}>{title}</div>}
      {sub && <div style={{ padding: '0 16px 12px', fontSize: 13, color: 'var(--cy-muted)' }}>{sub}</div>}
    </div>
  );
}

// ─── Bottom nav ────────────────────────────────────────
function BottomNav({ active = 'home' }) {
  const items = [
    { id: 'home', label: 'Inicio', icon: Icon.home },
    { id: 'map',  label: 'Mapa',   icon: Icon.map },
    { id: 'match',label: 'Partidos', icon: Icon.bolt },
    { id: 'chat', label: 'Chat',    icon: Icon.chat },
    { id: 'me',   label: 'Yo',      icon: Icon.user },
  ];
  return (
    <div style={{ borderTop: '2px solid var(--cy-line)', background: 'var(--cy-paper)', display: 'flex' }}>
      {items.map((it, i) => {
        const isActive = it.id === active;
        const I = it.icon;
        return (
          <div key={it.id} style={{
            flex: 1, padding: '10px 0 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: isActive ? 'var(--cy-ink)' : 'transparent',
            color: isActive ? 'var(--cy-accent)' : 'var(--cy-ink)',
            borderRight: i < items.length - 1 ? '1.5px solid var(--cy-line)' : 'none',
            position: 'relative',
          }}>
            <I/>
            <span className="cy-mono" style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Court type pill ──────────────────────────────────
function CourtType({ type }) {
  const icon = type.includes('padel') || type.includes('pádel') ? <Icon.padel/> : <Icon.ball/>;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1.5px solid var(--cy-line)', padding: '3px 8px', fontFamily: 'var(--cy-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>
      {icon}{type}
    </span>
  );
}

// ─── Rating row ────────────────────────────────────────
function Rating({ value = 4.8, count = 132 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Icon.star style={{ color: 'var(--cy-ink)' }}/>
      <span className="cy-mono" style={{ fontSize: 11, fontWeight: 700 }}>{value}</span>
      <span className="cy-mono" style={{ fontSize: 10, color: 'var(--cy-muted)' }}>({count})</span>
    </span>
  );
}

Object.assign(window, { Icon, Chip, MastheadMobile, BottomNav, CourtType, Rating });
