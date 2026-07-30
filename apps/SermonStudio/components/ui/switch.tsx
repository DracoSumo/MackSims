
'use client'
import * as React from 'react'
export function Switch({ checked=false, onCheckedChange, id }:{ checked?: boolean; onCheckedChange?: (v:boolean)=>void; id?:string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className='switch'
    >
      <span className='switch-knob' style={{ transform: checked ? 'translateX(20px)' : 'translateX(2px)' }} />
    </button>
  )
}
