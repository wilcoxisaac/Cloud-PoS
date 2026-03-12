import React from 'react'

export default function ElavonLogo({ size = 32, color = '#0A1638', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0,0 L48,0 Q80,50 48,100 L0,100 Z M80,0 L128,0 L128,100 L80,100 Q48,50 80,0 Z"
        fill={color}
      />
    </svg>
  )
}
