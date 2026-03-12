import React from 'react'

export default function ElavonLogo({ size = 32, color = '#0A1638', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 130 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0,0 L50,0 L65,50 L50,100 L0,100 Z M80,0 L130,0 L130,100 L80,100 L65,50 Z"
        fill={color}
      />
    </svg>
  )
}
