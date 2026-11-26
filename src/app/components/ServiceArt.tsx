/**
 * Spot illustrations for the "What I do" cards. Inline SVG (2:1, like the project
 * screenshots), drawn with theme classes (`.svc-art .i-*` in globals.css) so they
 * follow light and dark mode and the site's green. No <text>: bars stand in for words.
 */

const svgProps = {
  viewBox: "0 0 320 160",
  className: "svc-art-svg",
  "aria-hidden": true,
  focusable: false,
} as const;

/** Websites & mobile apps: a browser window with a phone in front of it. */
function WebApps() {
  return (
    <svg {...svgProps}>
      <rect className="i-panel" x="36" y="20" width="196" height="124" rx="10" />
      <path className="i-fill" d="M46 20h176a10 10 0 0 1 10 10v8H36v-8a10 10 0 0 1 10-10z" />
      <circle className="i-dot" cx="49" cy="29" r="2.5" />
      <circle className="i-dot" cx="57" cy="29" r="2.5" />
      <circle className="i-dot" cx="65" cy="29" r="2.5" />
      <rect className="i-ink" x="52" y="52" width="88" height="8" rx="4" />
      <rect className="i-line" x="52" y="66" width="112" height="5" rx="2.5" />
      <rect className="i-line" x="52" y="76" width="92" height="5" rx="2.5" />
      <rect className="i-accent" x="52" y="90" width="48" height="14" rx="7" />
      <rect className="i-soft" x="150" y="50" width="54" height="54" rx="8" />
      <circle className="i-accent" cx="167" cy="66" r="5" />
      <polyline className="i-stroke" points="156,98 171,82 182,91 193,79 200,98" />
      <rect className="i-fill" x="52" y="116" width="42" height="16" rx="4" />
      <rect className="i-fill" x="100" y="116" width="42" height="16" rx="4" />
      <rect className="i-fill" x="148" y="116" width="42" height="16" rx="4" />
      <rect className="i-panel" x="214" y="40" width="70" height="112" rx="13" />
      <rect className="i-fill" x="239" y="47" width="20" height="4" rx="2" />
      <rect className="i-soft" x="224" y="60" width="50" height="30" rx="6" />
      <rect className="i-ink" x="224" y="98" width="40" height="6" rx="3" />
      <rect className="i-line" x="224" y="110" width="30" height="5" rx="2.5" />
      <rect className="i-accent" x="224" y="128" width="50" height="13" rx="6.5" />
    </svg>
  );
}

/** AI that saves time: a chat that answers itself, with sparkles. */
function AiAutomation() {
  return (
    <svg {...svgProps}>
      <rect className="i-panel" x="44" y="16" width="178" height="128" rx="12" />
      <rect className="i-fill" x="58" y="30" width="98" height="22" rx="11" />
      <rect className="i-soft" x="108" y="60" width="100" height="22" rx="11" />
      <rect className="i-fill" x="58" y="90" width="120" height="22" rx="11" />
      <circle className="i-accent" cx="76" cy="101" r="3" />
      <circle className="i-accent i-faint" cx="87" cy="101" r="3" />
      <circle className="i-accent i-fainter" cx="98" cy="101" r="3" />
      <rect className="i-line" x="58" y="122" width="150" height="10" rx="5" />
      <path
        className="i-accent"
        d="M262 30c2 17 6 21 23 23-17 2-21 6-23 23-2-17-6-21-23-23 17-2 21-6 23-23z"
      />
      <path
        className="i-accent i-faint"
        d="M284 92c1 8 3 10 11 11-8 1-10 3-11 11-1-8-3-10-11-11 8-1 10-3 11-11z"
      />
      <path
        className="i-accent i-fainter"
        d="M246 106c.8 6 2 7.2 8 8-6 .8-7.2 2-8 8-.8-6-2-7.2-8-8 6-.8 7.2-2 8-8z"
      />
    </svg>
  );
}

/** Easy-to-use design: an artboard with a selected card, a cursor and colour swatches. */
function Design() {
  return (
    <svg {...svgProps}>
      <rect className="i-panel" x="36" y="18" width="176" height="124" rx="10" />
      <rect className="i-fill" x="50" y="32" width="148" height="10" rx="5" />
      <rect className="i-soft" x="54" y="54" width="82" height="72" rx="8" />
      <rect className="i-wire" x="49" y="49" width="92" height="82" rx="11" />
      <rect className="i-handle" x="46" y="46" width="6" height="6" rx="1.5" />
      <rect className="i-handle" x="138" y="46" width="6" height="6" rx="1.5" />
      <rect className="i-handle" x="46" y="128" width="6" height="6" rx="1.5" />
      <rect className="i-handle" x="138" y="128" width="6" height="6" rx="1.5" />
      <rect className="i-ink" x="148" y="56" width="50" height="8" rx="4" />
      <rect className="i-line" x="148" y="70" width="44" height="5" rx="2.5" />
      <rect className="i-line" x="148" y="80" width="36" height="5" rx="2.5" />
      <rect className="i-accent" x="148" y="108" width="44" height="14" rx="7" />
      <path className="i-cursor" d="M141 126v21l5.5-5.2 4.3 9.2 4-1.9-4.3-9h7.6z" />
      <rect className="i-panel" x="232" y="26" width="48" height="110" rx="24" />
      <circle className="i-accent" cx="256" cy="52" r="12" />
      <circle className="i-ink" cx="256" cy="81" r="12" />
      <circle className="i-soft i-ringed" cx="256" cy="110" r="12" />
    </svg>
  );
}

/** Safe online payments: a phone showing a paid tick, coins and a shield. */
function Payments() {
  return (
    <svg {...svgProps}>
      <ellipse className="i-soft i-ringed" cx="70" cy="128" rx="26" ry="8" />
      <ellipse className="i-soft i-ringed" cx="70" cy="117" rx="26" ry="8" />
      <ellipse className="i-accent" cx="70" cy="106" rx="26" ry="8" />
      <rect className="i-panel" x="118" y="10" width="86" height="142" rx="14" />
      <rect className="i-fill" x="151" y="17" width="20" height="4" rx="2" />
      <circle className="i-accent" cx="161" cy="58" r="20" />
      <polyline className="i-check" points="151,58 158,65 172,51" />
      <rect className="i-ink" x="137" y="90" width="48" height="8" rx="4" />
      <rect className="i-line" x="145" y="104" width="32" height="5" rx="2.5" />
      <rect className="i-soft" x="133" y="124" width="56" height="14" rx="7" />
      <path className="i-panel i-shield" d="M252 42l28 11v25c0 19-12 32-28 38-16-6-28-19-28-38V53z" />
      <path className="i-stroke" d="M245 79v-6a7 7 0 0 1 14 0v6" />
      <rect className="i-accent" x="241" y="79" width="22" height="18" rx="4" />
    </svg>
  );
}

/** The engine behind your app: a cloud connected to three servers. */
function Backend() {
  return (
    <svg {...svgProps}>
      <path
        className="i-soft i-ringed"
        d="M122 64c-15 0-21-15-10-23 0-15 17-21 27-13 7-13 30-15 38 0 13-8 31 0 29 14 13 2 13 22-1 22z"
      />
      <path className="i-wire" d="M160 64v34" />
      <path className="i-wire" d="M140 64c0 18-60 16-60 34" />
      <path className="i-wire" d="M180 64c0 18 60 16 60 34" />
      {[50, 130, 210].map((x) => (
        <g key={x}>
          <rect className="i-panel" x={x} y="98" width="60" height="20" rx="5" />
          <rect className="i-panel" x={x} y="122" width="60" height="20" rx="5" />
          <circle className="i-accent" cx={x + 11} cy="108" r="3" />
          <circle className="i-accent i-faint" cx={x + 11} cy="132" r="3" />
          <rect className="i-line" x={x + 20} y="106" width="30" height="4" rx="2" />
          <rect className="i-line" x={x + 20} y="130" width="24" height="4" rx="2" />
        </g>
      ))}
    </svg>
  );
}

/** Business tools: a dashboard with a menu, stat cards, a bar chart and a donut. */
function Dashboard() {
  return (
    <svg {...svgProps}>
      <rect className="i-panel" x="30" y="14" width="260" height="132" rx="10" />
      <path className="i-fill" d="M40 14h36v132H40a10 10 0 0 1-10-10V24a10 10 0 0 1 10-10z" />
      <rect className="i-line" x="42" y="32" width="22" height="5" rx="2.5" />
      <rect className="i-line" x="42" y="46" width="22" height="5" rx="2.5" />
      <rect className="i-accent" x="42" y="60" width="22" height="5" rx="2.5" />
      <rect className="i-line" x="42" y="74" width="22" height="5" rx="2.5" />
      {[88, 154, 220].map((x, i) => (
        <g key={x}>
          <rect className="i-fill" x={x} y="26" width="58" height="30" rx="6" />
          <rect className={i === 0 ? "i-accent" : "i-ink"} x={x + 9} y="34" width="22" height="7" rx="3.5" />
          <rect className="i-line" x={x + 9} y="45" width="34" height="4" rx="2" />
        </g>
      ))}
      <rect className="i-soft" x="98" y="110" width="12" height="18" rx="3" />
      <rect className="i-soft" x="116" y="96" width="12" height="32" rx="3" />
      <rect className="i-soft" x="134" y="102" width="12" height="26" rx="3" />
      <rect className="i-accent" x="152" y="84" width="12" height="44" rx="3" />
      <rect className="i-soft" x="170" y="92" width="12" height="36" rx="3" />
      <rect className="i-accent" x="188" y="74" width="12" height="54" rx="3" />
      <rect className="i-line" x="92" y="130" width="114" height="2" rx="1" />
      <circle className="i-donut" cx="250" cy="102" r="22" />
      <circle className="i-donut-fill" cx="250" cy="102" r="22" transform="rotate(-90 250 102)" />
    </svg>
  );
}

export const SERVICE_ART = {
  web: WebApps,
  ai: AiAutomation,
  design: Design,
  payments: Payments,
  backend: Backend,
  business: Dashboard,
} as const;

export type ServiceArtKey = keyof typeof SERVICE_ART;
