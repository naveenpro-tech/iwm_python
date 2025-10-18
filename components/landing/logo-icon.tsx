interface LogoIconProps {
  size?: number
}

export function LogoIcon({ size = 40 }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="url(#paint0_linear)" />
      <path
        d="M12 14C12 12.8954 12.8954 12 14 12H26C27.1046 12 28 12.8954 28 14V26C28 27.1046 27.1046 28 26 28H14C12.8954 28 12 27.1046 12 26V14Z"
        fill="#1A1A1A"
      />
      <path d="M16 18L20 16V24L16 22V18Z" fill="url(#paint1_linear)" />
      <path d="M24 18L20 16V24L24 22V18Z" fill="url(#paint2_linear)" />
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00BFFF" />
          <stop offset="1" stopColor="#FFD700" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="16" y1="16" x2="20" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00BFFF" />
          <stop offset="1" stopColor="#00BFFF" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="paint2_linear" x1="20" y1="16" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFD700" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  )
}
