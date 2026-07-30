
import * as React from 'react'
export function Button({ className='', variant='primary', size='md', type='button', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?:'primary'|'outline'|'secondary'|'destructive'; size?:'sm'|'md'}) {
  const classes = [
    'btn',
    variant==='primary' && 'btn-primary',
    variant==='outline' && 'btn-outline',
    variant==='secondary' && 'btn-outline',
    variant==='destructive' && 'bg-red-600 text-white hover:bg-red-500',
    size==='sm' && 'px-3 py-1.5 text-xs',
  ].filter(Boolean).join(' ')
  return <button type={type} className={`${classes} ${className}`} {...props} />
}
