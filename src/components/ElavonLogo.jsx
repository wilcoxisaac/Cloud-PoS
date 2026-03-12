import React from 'react'

export default function ElavonLogo({ size = 32, color = '#0A1638', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8,10 L38,10 L38,20 Q50,50 38,80 L38,90 L8,90 Z
           M62,10 L92,10 L92,90 L62,90 L62,80 Q50,50 62,20 Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  )
}

export function ElavonLogoMark({ size = 24, color = 'currentColor', className = '' }) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0,0 L30,0 L30,10 Q50,40 30,70 L30,80 L0,80 Z
           M70,0 L100,0 L100,80 L70,80 L70,70 Q50,40 70,10 Z"
        fill={color}
      />
    </svg>
  )
}
