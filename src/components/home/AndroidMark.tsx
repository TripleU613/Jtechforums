/**
 * The Android robot between code brackets, drawn in the page's own ink so it
 * sits in black and white on either theme (it was a navy-and-blue picture).
 */
export default function AndroidMark() {
  return (
    <svg className="android-mark" viewBox="0 0 1536 1024" role="presentation" aria-hidden="true">
      <defs>
        <pattern id="android-mark-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" />
        </pattern>
      </defs>
      <rect className="android-mark-grid" width="1536" height="1024" fill="url(#android-mark-grid)" />
      <g className="android-mark-robot">
        <path d="M600 314 548 222M936 314l52-92" strokeWidth="22" strokeLinecap="round" />
        <path d="M460 666a308 308 0 0 1 616 0Z" />
      </g>
      <g className="android-mark-ink">
        <ellipse cx="618" cy="546" rx="28" ry="34" />
        <ellipse cx="918" cy="546" rx="28" ry="34" />
        <path d="M402 412 218 516l184 104v-64l-80-40 80-40Z" />
        <path d="m1134 412 184 104-184 104v-64l80-40-80-40Z" />
      </g>
    </svg>
  );
}
