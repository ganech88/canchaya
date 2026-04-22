export interface TimelineEvent {
  date: string // '27 MAR · 22:02'
  text: string
}

interface Props {
  events: TimelineEvent[]
}

export function EventsTimeline({ events }: Props) {
  return (
    <div>
      {events.map((e, i) => (
        <div key={i} className="flex gap-3.5 border-b border-cy-line py-2.5">
          <div className="w-[130px] shrink-0 font-mono text-[10px] text-cy-muted">{e.date}</div>
          <div className="text-[13px] text-cy-ink">{e.text}</div>
        </div>
      ))}
    </div>
  )
}
