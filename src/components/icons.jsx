/**
 * Ícones em SVG inline (traço de 1.8px, grade 24) — sem dependências externas.
 */
const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const make = (paths, opts = {}) =>
  function Icon({ size = 18, ...rest }) {
    return (
      <svg {...base} {...opts} width={size} height={size} aria-hidden="true" {...rest}>
        {paths}
      </svg>
    )
  }

export const Bolt = make(<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />)
export const BoltFill = make(<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" fill="currentColor" />)

export const Dashboard = make(
  <>
    <rect x="3" y="3" width="7.5" height="8.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="5.5" rx="2" />
    <rect x="3" y="15" width="7.5" height="6" rx="2" />
    <rect x="13.5" y="12" width="7.5" height="9" rx="2" />
  </>
)

export const Flow = make(
  <>
    <rect x="3" y="3" width="6.5" height="6" rx="2" />
    <rect x="14.5" y="15" width="6.5" height="6" rx="2" />
    <path d="M6.25 9v4a5 5 0 0 0 5 5h3.25" />
  </>
)

export const Route = make(
  <>
    <circle cx="6" cy="19" r="2.5" />
    <circle cx="18" cy="5" r="2.5" />
    <path d="M15.5 5H10a3.5 3.5 0 0 0 0 7h4a3.5 3.5 0 0 1 0 7H8.5" />
  </>
)

export const Gear = make(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.9 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.7 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
  </>
)

export const Search = make(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </>
)

export const Plus = make(<path d="M12 5v14M5 12h14" />)
export const X = make(<path d="M18 6 6 18M6 6l12 12" />)
export const Check = make(<path d="m4.5 12.5 5 5 10-11" strokeWidth="2.4" />)

export const Trash = make(
  <>
    <path d="M4 7h16M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
    <path d="M6.5 7 7.5 20a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1L17.5 7" />
    <path d="M10.5 11v6M13.5 11v6" />
  </>
)

export const Pencil = make(
  <>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    <path d="m14.5 5.5 3 3" />
  </>
)

export const Copy = make(
  <>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </>
)

export const Up = make(<path d="m6 15 6-6 6 6" />)
export const Down = make(<path d="m6 9 6 6 6-6" />)
export const Right = make(<path d="M5 12h13m-5-6 6 6-6 6" />)

export const Calendar = make(
  <>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </>
)

export const Checklist = make(
  <>
    <path d="m3 6 2 2 3-3.5M3 13l2 2 3-3.5M3 20l2 2 3-3.5" />
    <path d="M12 6h9M12 14h9M12 21h9" />
  </>
)

export const Clock = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.5l3.5 2" />
  </>
)

export const Download = make(
  <>
    <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </>
)

export const Upload = make(
  <>
    <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </>
)

export const Menu = make(<path d="M4 7h16M4 12h16M4 17h16" />)

export const Trend = make(
  <>
    <path d="M3 17.5 9.5 11l4 4L21 7" />
    <path d="M15.5 7H21v5.5" />
  </>
)

export const Alert = make(
  <>
    <path d="M10.3 4.3 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4M12 17.2h.01" />
  </>
)

export const Target = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </>
)

export const Layers = make(
  <>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5M3 17.5l9 5 9-5" />
  </>
)

export const Sparkle = make(
  <>
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.8L12 18l-1.7-5.5-5.5-1.8L10.3 9 12 3.5Z" />
    <path d="M19 3v3M20.5 4.5h-3M5 17v2.5M6.2 18.2H3.8" />
  </>
)

export const Play = make(<path d="M7 4.5v15l12-7.5-12-7.5Z" strokeLinejoin="round" />)
export const Pause = make(<path d="M8.5 5v14M15.5 5v14" strokeWidth="2.2" />)

export const Save = make(
  <>
    <path d="M5 3h11l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M8 3v6h8V4M8 14h8v7H8z" />
  </>
)

export const Grip = make(
  <>
    <circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none" />
  </>
)
