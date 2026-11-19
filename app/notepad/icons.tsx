type IconProps = {
  className?: string
}

function NotepadIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 3h16l4 4v22H7z"
        fill="#fff"
        stroke="#6d6d6d"
        strokeWidth="1.2"
      />
      <path d="M23 3v4h4" fill="#d8d8d8" stroke="#6d6d6d" strokeWidth="1.2" />
      <path
        d="M10 10h12M10 14h12M10 18h12M10 22h8"
        stroke="#3a6fb0"
        strokeWidth="1.5"
      />
      <path
        d="m19.2 21.2 5.3-5.3 2.6 2.6-5.3 5.3-3.3.7z"
        fill="#f3c54b"
        stroke="#8a6410"
        strokeWidth="1"
      />
      <path d="m24.5 15.9 2.6 2.6" stroke="#8a6410" strokeWidth="1" />
    </svg>
  )
}

function ComputerIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3"
        y="5"
        width="23"
        height="17"
        rx="1"
        fill="#e9eef5"
        stroke="#39547c"
      />
      <rect x="6" y="8" width="17" height="11" fill="#5d8fc4" />
      <path d="M8 9h13v9H8z" fill="#8fb7e2" />
      <path d="M12 22h8l2 5H10z" fill="#c7ceda" stroke="#39547c" />
      <rect x="8" y="26" width="16" height="2" fill="#8b97a8" />
      <path d="M25 10h4v12h-2V12h-2z" fill="#9fb0c6" stroke="#39547c" />
    </svg>
  )
}

function FolderIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 9h10l3 3h13v15H3z"
        fill="#f6c453"
        stroke="#8a6410"
        strokeWidth="1.2"
      />
      <path
        d="M3 13h26v14H3z"
        fill="#ffe08a"
        stroke="#8a6410"
        strokeWidth="1.2"
      />
      <path d="M5 15h22v4H5z" fill="#fff3c4" opacity=".55" />
    </svg>
  )
}

function RecycleBinIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 9h16l-2 19H10z"
        fill="#d9e2ea"
        stroke="#5c6b7a"
        strokeWidth="1.2"
      />
      <path d="M7 8h18v3H7z" fill="#aebdca" stroke="#5c6b7a" />
      <path d="M13 7h6v2h-6z" fill="#8fa1b1" stroke="#5c6b7a" />
      <path
        d="M12 13v11M16 13v11M20 13v11"
        stroke="#8fa1b1"
        strokeWidth="1.4"
      />
      <path
        d="m17 12 3 3-2 1-1-2z"
        fill="#4f9a52"
        stroke="#2f6b33"
        strokeWidth=".8"
      />
    </svg>
  )
}

function MinimizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 7h6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function MaximizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M2 2h6v6H2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M2 2h6" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  )
}

function RestoreIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M3 1h6v6H3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M1 3h6v6H1z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="m2 2 6 6M8 2 2 8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="m1.5 5.2 2.3 2.3 4.8-5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="m2 3.5 3 3 3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 6h3l4-3v10L5 10H2z" fill="#fff" stroke="#0a3f8f" />
      <path
        d="M11 5.5c1.1.8 1.1 4.2 0 5M13 3.8c2.2 1.6 2.2 6.8 0 8.4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function StartFlag() {
  return (
    <span className="xp-start-flag" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  )
}

function WarningIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 3.5 30 28H2z"
        fill="#fcf45a"
        stroke="#8a6d00"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M16 11.5v8"
        fill="none"
        stroke="#000"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="24" r="1.6" fill="#000" />
    </svg>
  )
}

function HelpIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M5 4h17l5 5v19H5z"
        fill="#eaf3fd"
        stroke="#3c5c86"
        strokeWidth="1.2"
      />
      <path d="M22 4v5h5" fill="#c2d6ee" stroke="#3c5c86" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="7.5" fill="#2f6fc4" stroke="#1c4787" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#fff"
      >
        ?
      </text>
    </svg>
  )
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle
        cx="13.5"
        cy="13.5"
        r="8"
        fill="#e6f0fb"
        stroke="#3c5c86"
        strokeWidth="1.6"
      />
      <circle cx="13.5" cy="13.5" r="5.5" fill="#bcd7f2" />
      <path
        d="m19.6 19.6 8 8"
        stroke="#5a6b7f"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="26"
        height="22"
        rx="1"
        fill="#eef4fb"
        stroke="#3c5c86"
        strokeWidth="1.2"
      />
      <rect x="3" y="5" width="26" height="6" fill="#2f6fc4" />
      <circle cx="9" cy="17" r="3" fill="#f3c54b" stroke="#8a6410" />
      <circle cx="20" cy="17" r="3" fill="#77b255" stroke="#3f6b2a" />
      <rect x="13" y="21" width="6" height="2" fill="#8a97a8" />
      <rect x="24" y="21" width="3" height="2" fill="#8a97a8" />
    </svg>
  )
}

function RunIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect
        x="4"
        y="6"
        width="24"
        height="20"
        rx="1"
        fill="#f4f8fd"
        stroke="#3c5c86"
        strokeWidth="1.2"
      />
      <rect x="4" y="6" width="24" height="5" fill="#2f6fc4" />
      <path d="M9 16h10" stroke="#2f6fc4" strokeWidth="2.4" />
      <path d="m18 12 5 4-5 4z" fill="#3f9b3f" stroke="#26661f" />
    </svg>
  )
}

function PowerIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="11" fill="#f6d9cf" stroke="#a5432a" />
      <path
        d="M16 10v6"
        stroke="#b33a1c"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M11.4 12.4a7 7 0 1 0 9.2 0"
        fill="none"
        stroke="#b33a1c"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LogOffIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="11" fill="#e6eef8" stroke="#3c5c86" />
      <path
        d="M12 16h10M18 12l4 4-4 4"
        fill="none"
        stroke="#2f6fc4"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="12" r="6" fill="#7d97b8" />
      <path
        d="M5 29c0-6 5-9.5 11-9.5S27 23 27 29z"
        fill="#7d97b8"
      />
    </svg>
  )
}

function ProgramsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="4" width="10" height="10" rx="1" fill="#f35325" />
      <rect x="16" y="4" width="10" height="10" rx="1" fill="#81bc06" />
      <rect x="4" y="16" width="10" height="10" rx="1" fill="#05a6f0" />
      <rect x="16" y="16" width="10" height="10" rx="1" fill="#ffba08" />
      <path
        d="m14 24 8-8 3 3-8 8z"
        fill="#3f9b3f"
        stroke="#26661f"
        strokeWidth="1.2"
      />
    </svg>
  )
}

export {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  ComputerIcon,
  FolderIcon,
  HelpIcon,
  LogOffIcon,
  MaximizeIcon,
  MinimizeIcon,
  NotepadIcon,
  PowerIcon,
  ProgramsIcon,
  RecycleBinIcon,
  RestoreIcon,
  RunIcon,
  SearchIcon,
  SettingsIcon,
  SpeakerIcon,
  StartFlag,
  UserIcon,
  WarningIcon,
}
