/* One doodle per migration label, index-aligned with LABELS.
   Shared style: gold strokes, occasional accent fills, 120×120 viewBox. */

import cricketGoats from "../assets/cricket.jpg";

const S = { stroke: "#E8B54D", strokeWidth: 4.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
const MUT = { ...S, stroke: "#7E8398", strokeWidth: 3 };
const RED = { ...S, stroke: "#E4374F" };
const svgProps = { viewBox: "0 0 120 120", className: "mig-art" };
const T = { fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, textAnchor: "middle" };

/* Paper plane with dotted trail — used for both travelling steps. */
const PLANE = (
  <svg {...{ viewBox: "0 0 120 120", className: "mig-art" }} key="travel">
    <path d="M18 96 q14 -10 28 -26" strokeDasharray="2 9" {...{ stroke: "#7E8398", strokeWidth: 3, fill: "none", strokeLinecap: "round" }} />
    <path d="M50 66 L104 22 L84 74 L68 60 Z M104 22 L68 60 M68 60 L66 76 L74 68" {...{ stroke: "#E8B54D", strokeWidth: 4.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }} />
  </svg>
);

/* Alternate art swapped in when a morph label reveals (keyed by name). */
export const MORPH_ART = {
  workaholic: (
    <svg {...{ viewBox: "0 0 120 120", className: "mig-art" }} key="workaholic">
      <rect x="24" y="26" width="56" height="38" rx="4" {...S} />
      <path d="M16 76 H88 L80 64 H32 Z" {...S} />
      <path d="M96 60 H112 V78 Q112 86 104 86 Q96 86 96 78 Z" {...S} />
      <path d="M100 52 q4 -6 0 -12 M107 52 q4 -6 0 -12" {...MUT} />
      <text x="52" y="50" {...T} fontSize="12" fill="#E8B54D">9–9</text>
    </svg>
  ),
};

export const ART = [
  /* 1 · Swiggy scooter */
  <svg {...svgProps} key="swiggy">
    <circle cx="30" cy="88" r="12" {...S} />
    <circle cx="92" cy="88" r="12" {...S} />
    <path d="M42 88 H70 L82 64 H96" {...S} />
    <path d="M92 88 L82 64 M82 64 L78 50 M70 48 H88" {...S} />
    <rect x="18" y="50" width="28" height="24" rx="3" {...S} />
    <path d="M8 62 H2 M12 74 H4" {...MUT} />
  </svg>,
  /* 2 · Kannada Gothilla */
  <svg {...svgProps} key="kannada">
    <rect x="8" y="20" width="56" height="30" rx="9" {...MUT} />
    <path d="M22 50 L18 62 L34 50" {...MUT} />
    <text x="36" y="40" {...T} fontSize="13" fill="#7E8398">KANNADA?</text>
    <rect x="52" y="62" width="60" height="30" rx="9" {...S} />
    <path d="M96 92 L102 104 L84 92" {...S} />
    <text x="82" y="82" {...T} fontSize="13" fill="#E8B54D">GOTHILLA</text>
  </svg>,
  /* 4 · Cricket is my religion — GOAT silhouette poster */
  <img className="mig-photo" src={cricketGoats} alt="" key="cricket" />,
  /* · Meghana's is overrated */
  <svg {...svgProps} key="meghanas">
    <text x="60" y="24" {...T} fontSize="18" fill="#E8B54D">★★★☆☆</text>
    <circle cx="60" cy="70" r="34" {...S} />
    <circle cx="60" cy="70" r="21" {...MUT} />
    <text x="60" y="77" {...T} fontSize="17" fill="#F2EFE6" letterSpacing="1">MEH</text>
  </svg>,
  /* 6 · MasterChef of Maggi */
  <svg {...svgProps} key="maggi">
    <path d="M30 58 V84 Q30 93 39 93 H81 Q90 93 90 84 V58 M24 58 H96" {...S} />
    <path d="M16 64 H24 M96 64 H104" {...S} />
    <path d="M36 50 q6 -9 12 0 q6 9 12 0 q6 -9 12 0 q6 9 12 0" {...S} />
    <path d="M46 34 q4 -7 0 -13 M64 36 q4 -7 0 -13 M56 28 q4 -7 0 -13" {...MUT} />
    <text x="60" y="80" {...T} fontSize="13" fill="#E8B54D">2 MIN</text>
  </svg>,
  /* · Vegetable Biryani is a myth */
  <svg {...svgProps} key="vegbiryani">
    <path d="M30 62 Q30 90 60 90 Q90 90 90 62 M26 62 H94" {...S} />
    <path d="M32 62 Q60 44 88 62" {...S} />
    <circle cx="44" cy="26" r="8" fill="#2FBF71" />
    <path d="M62 34 L74 18 L70 36 Z" fill="#EE8F1F" />
    <circle cx="57" cy="27" r="24" {...RED} />
    <path d="M40 44 L74 10" {...RED} />
  </svg>,
  /* 6 · Breaking Bad > GoT */
  <svg {...svgProps} key="bbgot">
    <path d="M22 22 H42 M26 22 V38 L14 62 Q11 72 20 72 H44 Q53 72 50 62 L38 38 V22" {...S} />
    <path d="M20 58 H44" stroke="#2FBF71" strokeWidth="4.5" strokeLinecap="round" />
    <text x="63" y="58" {...T} fontSize="30" fill="#F2EFE6">&gt;</text>
    <path d="M78 66 V50 L88 58 L96 42 L104 58 L114 50 V66 Z" {...S} />
  </svg>,
  /* 7 · Complains about traffic, drives alone */
  <svg {...svgProps} key="traffic">
    <path d="M18 80 Q18 66 32 66 H44 L54 50 H78 L88 66 H100 Q106 66 106 74 V80" {...S} />
    <circle cx="36" cy="82" r="9" {...S} />
    <circle cx="88" cy="82" r="9" {...S} />
    <path d="M58 52 L52 66 H74 L70 52" {...MUT} />
    <text x="96" y="30" {...T} fontSize="15" fill="#E4374F">@#$!</text>
  </svg>,
  /* 9 · One more episode at 2am */
  <svg {...svgProps} key="2am">
    <path d="M82 18 A26 26 0 1 0 104 54 A20 20 0 1 1 82 18 Z" fill="#F6DC8E" />
    <circle cx="40" cy="74" r="22" {...S} />
    <path d="M40 74 V58 M40 74 L50 80" {...S} />
    <text x="40" y="112" {...T} fontSize="12" fill="#7E8398">2:00 AM</text>
  </svg>,
  /* 10 · Gym membership, been twice */
  <svg {...svgProps} key="gym">
    <path d="M36 64 H84" {...S} />
    <rect x="22" y="48" width="9" height="32" rx="2" {...S} />
    <rect x="34" y="54" width="7" height="20" rx="2" {...S} />
    <rect x="79" y="54" width="7" height="20" rx="2" {...S} />
    <rect x="89" y="48" width="9" height="32" rx="2" {...S} />
    <path d="M6 6 V30 M6 6 H30 M6 6 L24 24 M6 22 Q14 20 20 10 M6 14 Q10 13 13 7" {...MUT} strokeWidth="2.5" />
    <text x="60" y="108" {...T} fontSize="11" fill="#7E8398" letterSpacing="2">SINCE JANUARY</text>
  </svg>,
  /* 12 · "Quick sync", 40 minutes */
  <svg {...svgProps} key="sync">
    <circle cx="60" cy="56" r="32" {...S} />
    <path d="M60 56 V34 M60 56 L76 64" {...S} />
    <path d="M98 24 A48 48 0 0 1 102 68" {...RED} strokeWidth="3.5" />
    <path d="M102 68 l-7 -4 M102 68 l3 -8" {...RED} strokeWidth="3.5" />
    <text x="60" y="110" {...T} fontSize="12" fill="#E4374F">40:00…</text>
  </svg>,
  /* 13 · Replies six days later */
  <svg {...svgProps} key="6days">
    <rect x="14" y="28" width="62" height="38" rx="10" {...S} />
    <circle cx="32" cy="47" r="3.5" fill="#7E8398" />
    <circle cx="45" cy="47" r="3.5" fill="#7E8398" />
    <circle cx="58" cy="47" r="3.5" fill="#7E8398" />
    <rect x="72" y="58" width="36" height="36" rx="5" {...S} />
    <path d="M72 68 H108 M81 58 V50 M99 58 V50" {...S} />
    <text x="90" y="86" {...T} fontSize="15" fill="#E8B54D">6d</text>
  </svg>,
  /* 14 · My cooking is the best */
  <svg {...svgProps} key="cooking">
    <path d="M28 68 H82 M30 68 Q30 88 56 88 Q80 88 80 68" {...S} />
    <path d="M82 70 H104" {...S} />
    <path d="M42 56 q6 -10 0 -20 M56 58 q6 -10 0 -20 M70 56 q6 -10 0 -20" {...MUT} />
    <path d="M96 24 L106 42 H86 Z" {...RED} strokeWidth="3.5" />
    <text x="96" y="39" {...T} fontSize="12" fill="#E4374F">!</text>
  </svg>,
  /* 15 · Regional movies FDFS */
  <svg {...svgProps} key="fdfs">
    <path d="M24 44 L28 24 L98 32 L96 44" {...S} />
    <path d="M40 26 l-6 14 M56 28 l-6 13 M72 30 l-6 12 M88 31 l-6 12" {...MUT} />
    <rect x="24" y="44" width="72" height="44" rx="4" {...S} />
    <text x="60" y="72" {...T} fontSize="17" fill="#E8B54D">FDFS</text>
  </svg>,
  /* 16 · New food joints */
  <svg {...svgProps} key="foodjoints">
    <path d="M60 102 Q36 72 36 52 Q36 24 60 24 Q84 24 84 52 Q84 72 60 102 Z" {...S} />
    <path d="M52 38 V48 M60 38 V48 M68 38 V48 M60 48 V64" {...S} strokeWidth="3.5" />
  </svg>,
  /* 17 · New hobbies */
  <svg {...svgProps} key="hobbies">
    <path d="M18 102 L50 70" {...S} />
    <path d="M50 70 l10 10 l-16 6 Z" fill="#E8B54D" />
    <circle cx="84" cy="46" r="15" {...S} />
    <path d="M93 34 L110 14" {...S} />
    <text x="60" y="116" {...T} fontSize="10" fill="#7E8398" letterSpacing="2">ALL OF THEM · BRIEFLY</text>
  </svg>,
  /* 18 · Reading books */
  <svg {...svgProps} key="books">
    <rect x="28" y="76" width="64" height="13" rx="2" {...S} />
    <rect x="34" y="61" width="52" height="13" rx="2" {...S} />
    <rect x="40" y="46" width="40" height="13" rx="2" {...S} />
    <path d="M80 46 V32" stroke="#E4374F" strokeWidth="4" strokeLinecap="round" />
    <path d="M14 84 h6 M12 76 h5" {...MUT} strokeWidth="2.5" />
  </svg>,
  /* 19 · 140 Stack Overflow tabs */
  <svg {...svgProps} key="tabs">
    <rect x="14" y="30" width="92" height="64" rx="6" {...S} />
    <path d="M14 46 H106" {...S} />
    <path d="M24 30 V46 M32 30 V46 M40 30 V46 M48 30 V46 M56 30 V46 M64 30 V46 M72 30 V46 M80 30 V46 M88 30 V46 M96 30 V46" {...MUT} strokeWidth="2.5" />
    <text x="60" y="78" {...T} fontSize="18" fill="#E8B54D">140 TABS</text>
  </svg>,
  /* 16 · Only works near a deadline */
  <svg {...svgProps} key="deadline">
    <path d="M40 18 H80 M40 102 H80 M44 18 Q44 48 60 60 Q76 48 76 18 M44 102 Q44 72 60 60 Q76 72 76 102" {...S} />
    <path d="M52 94 L68 94 L60 78 Z" fill="#E8B54D" />
    <path d="M94 34 Q101 25 96 15 Q108 22 103 34 Q100 41 94 34 Z" fill="#EE8F1F" />
  </svg>,
  /* 17 · Docs after the third failure */
  <svg {...svgProps} key="docs">
    <text x="60" y="20" {...T} fontSize="15" fill="#E4374F">✕ ✕ ✕</text>
    <path d="M24 34 Q40 28 56 34 V90 Q40 84 24 90 Z" {...S} />
    <path d="M56 34 Q72 28 88 34 V90 Q72 84 56 90 Z" {...S} />
  </svg>,
  /* 18 · 4 hours automating 10 minutes */
  <svg {...svgProps} key="automate">
    <circle cx="44" cy="64" r="16" {...S} />
    <path d="M44 40 V32 M44 96 V88 M20 64 H28 M60 64 H68 M27 47 l6 6 M61 47 l-6 6 M27 81 l6 -6 M61 81 l-6 -6" {...S} />
    <circle cx="90" cy="38" r="14" {...S} />
    <path d="M90 38 V28 M90 38 H97" {...S} />
    <text x="90" y="72" {...T} fontSize="12" fill="#7E8398">4H → 10MIN</text>
  </svg>,
  /* 19 · "No meeting Friday" */
  <svg {...svgProps} key="friday">
    <rect x="28" y="26" width="64" height="64" rx="6" {...S} />
    <path d="M28 44 H92 M44 26 V16 M76 26 V16" {...S} />
    <text x="60" y="66" {...T} fontSize="16" fill="#E8B54D">FRI</text>
    <circle cx="60" cy="76" r="9" {...RED} strokeWidth="3.5" />
  </svg>,
  /* 20 · Serial Plant Killer */
  <svg {...svgProps} key="plant">
    <path d="M38 72 H82 L76 98 H44 Z M34 72 H86" {...S} />
    <path d="M60 72 Q58 50 46 42 Q40 36 42 26" stroke="#2FBF71" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M46 42 Q36 44 34 54" stroke="#2FBF71" strokeWidth="4" fill="none" strokeLinecap="round" />
    <text x="94" y="92" {...T} fontSize="11" fill="#7E8398">RIP</text>
  </svg>,
  /* 21 · Recipe says 1 tsp */
  <svg {...svgProps} key="recipe">
    <ellipse cx="36" cy="42" rx="13" ry="17" {...S} />
    <path d="M36 59 V102" {...S} />
    <text x="80" y="38" {...T} fontSize="12" fill="#7E8398">1 TSP</text>
    <path d="M64 34 H96" {...RED} strokeWidth="3" />
    <text x="80" y="66" {...T} fontSize="24" fill="#E8B54D">×3</text>
  </svg>,
  /* 22 · Trekking shoes, mall miles only */
  <svg {...svgProps} key="trekking">
    <path d="M28 34 H52 V60 L86 68 Q94 70 94 78 V86 H28 Z" {...S} />
    <path d="M34 42 H46 M34 50 H46" {...MUT} />
    <path d="M72 40 V24 H98 V40" {...S} />
    <path d="M78 24 Q85 12 92 24" {...S} />
  </svg>,
  /* 23 · Subtitles in a language they speak */
  <svg {...svgProps} key="subtitles">
    <rect x="24" y="20" width="72" height="50" rx="5" {...S} />
    <rect x="36" y="52" width="48" height="6" rx="2" fill="#CFC9B8" />
    <rect x="44" y="61" width="32" height="5" rx="2" fill="#7E8398" />
    <path d="M60 70 V82 M44 86 H76" {...S} />
  </svg>,
  /* · Big Kafka fan (Franz, the author) */
  <svg {...svgProps} key="kafka">
    <path d="M84 12 Q62 28 56 56 Q54 64 53 76 M84 12 Q74 32 61 44 M78 26 Q70 38 62 46" {...S} />
    <path d="M53 76 L48 92" {...S} />
    <path d="M24 96 Q44 88 60 96 Q76 88 96 96 V70 Q76 62 60 70 Q44 62 24 70 Z" {...MUT} />
    <path d="M60 70 V96" {...MUT} />
  </svg>,
  /* 27 · Wish this meeting did not take place */
  <svg {...svgProps} key="meeting">
    <rect x="24" y="26" width="72" height="68" rx="6" {...S} />
    <path d="M24 44 H96 M40 26 V16 M80 26 V16" {...S} />
    <path d="M44 58 L76 84 M76 58 L44 84" {...RED} strokeWidth="6" />
  </svg>,
  /* · I like travelling (Begur → Bellandur) */
  PLANE,
  /* 18 · Heart skips a beat */
  <svg {...svgProps} key="adventure">
    <path d="M60 96 L24 62 Q10 46 22 32 Q34 20 48 30 L60 42 L72 30 Q86 20 98 32 Q110 46 96 62 Z" {...S} />
    <path d="M28 62 H44 L52 48 L62 76 L70 58 H92" stroke="#E4374F" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  /* 19 · Alcoholic → workaholic */
  <svg {...svgProps} key="alcoholic">
    <path d="M38 16 H66 M42 16 V34 Q42 42 36 48 Q30 54 30 64 V96 Q30 102 38 102 H66 Q74 102 74 96 V64 Q74 54 68 48 Q62 42 62 34 V16" {...S} />
    <path d="M30 70 H74" {...S} />
    <rect x="80" y="52" width="30" height="20" rx="3" {...RED} strokeWidth="3.5" />
    <text x="95" y="66" {...T} fontSize="11" fill="#E4374F">MRP?</text>
  </svg>,
  /* 20 · Bullied by Kavya */
  <svg {...svgProps} key="kavya">
    <circle cx="60" cy="60" r="36" {...S} />
    <circle cx="47" cy="50" r="3.5" fill="#E8B54D" />
    <circle cx="73" cy="50" r="3.5" fill="#E8B54D" />
    <path d="M46 78 Q60 70 74 78" {...S} />
    <rect x="66" y="60" width="26" height="10" rx="4" transform="rotate(-35 79 65)" fill="#EE8F1F" />
    <path d="M20 22 l6 6 M30 16 l3 8 M14 34 l8 3" {...MUT} strokeWidth="3" />
  </svg>,
];
