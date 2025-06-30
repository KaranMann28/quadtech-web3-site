"use client"

import React from "react"

interface QuadTechLogoProps {
  className?: string
  size?: number
}

export function QuadTechLogo({ className = "", size = 32 }: QuadTechLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer hexagonal network structure */}
      <g className="animate-pulse">
        {/* Central core */}
        <circle cx="50" cy="50" r="3" fill="currentColor" className="opacity-100">
          <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Inner hexagon nodes */}
        <circle cx="50" cy="35" r="2" fill="currentColor" className="opacity-90" />
        <circle cx="63" cy="42.5" r="2" fill="currentColor" className="opacity-90" />
        <circle cx="63" cy="57.5" r="2" fill="currentColor" className="opacity-90" />
        <circle cx="50" cy="65" r="2" fill="currentColor" className="opacity-90" />
        <circle cx="37" cy="57.5" r="2" fill="currentColor" className="opacity-90" />
        <circle cx="37" cy="42.5" r="2" fill="currentColor" className="opacity-90" />
        
        {/* Outer hexagon nodes */}
        <circle cx="50" cy="20" r="2.5" fill="currentColor" className="opacity-80" />
        <circle cx="73" cy="35" r="2.5" fill="currentColor" className="opacity-80" />
        <circle cx="73" cy="65" r="2.5" fill="currentColor" className="opacity-80" />
        <circle cx="50" cy="80" r="2.5" fill="currentColor" className="opacity-80" />
        <circle cx="27" cy="65" r="2.5" fill="currentColor" className="opacity-80" />
        <circle cx="27" cy="35" r="2.5" fill="currentColor" className="opacity-80" />
        
        {/* Extended nodes */}
        <circle cx="50" cy="10" r="1.5" fill="currentColor" className="opacity-60" />
        <circle cx="80" cy="27.5" r="1.5" fill="currentColor" className="opacity-60" />
        <circle cx="80" cy="72.5" r="1.5" fill="currentColor" className="opacity-60" />
        <circle cx="50" cy="90" r="1.5" fill="currentColor" className="opacity-60" />
        <circle cx="20" cy="72.5" r="1.5" fill="currentColor" className="opacity-60" />
        <circle cx="20" cy="27.5" r="1.5" fill="currentColor" className="opacity-60" />
      </g>
      
      {/* Connection lines */}
      <g stroke="currentColor" strokeWidth="1" fill="none" className="opacity-70">
        {/* Central to inner hexagon */}
        <line x1="50" y1="50" x2="50" y2="35" />
        <line x1="50" y1="50" x2="63" y2="42.5" />
        <line x1="50" y1="50" x2="63" y2="57.5" />
        <line x1="50" y1="50" x2="50" y2="65" />
        <line x1="50" y1="50" x2="37" y2="57.5" />
        <line x1="50" y1="50" x2="37" y2="42.5" />
        
        {/* Inner to outer hexagon */}
        <line x1="50" y1="35" x2="50" y2="20" />
        <line x1="63" y1="42.5" x2="73" y2="35" />
        <line x1="63" y1="57.5" x2="73" y2="65" />
        <line x1="50" y1="65" x2="50" y2="80" />
        <line x1="37" y1="57.5" x2="27" y2="65" />
        <line x1="37" y1="42.5" x2="27" y2="35" />
        
        {/* Outer to extended nodes */}
        <line x1="50" y1="20" x2="50" y2="10" />
        <line x1="73" y1="35" x2="80" y2="27.5" />
        <line x1="73" y1="65" x2="80" y2="72.5" />
        <line x1="50" y1="80" x2="50" y2="90" />
        <line x1="27" y1="65" x2="20" y2="72.5" />
        <line x1="27" y1="35" x2="20" y2="27.5" />
        
        {/* Inner hexagon connections */}
        <line x1="50" y1="35" x2="63" y2="42.5" />
        <line x1="63" y1="42.5" x2="63" y2="57.5" />
        <line x1="63" y1="57.5" x2="50" y2="65" />
        <line x1="50" y1="65" x2="37" y2="57.5" />
        <line x1="37" y1="57.5" x2="37" y2="42.5" />
        <line x1="37" y1="42.5" x2="50" y2="35" />
      </g>
      
      {/* Glow effect */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <g filter="url(#glow)" className="opacity-50">
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </g>
    </svg>
  )
}
