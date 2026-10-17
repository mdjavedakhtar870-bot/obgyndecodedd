import { useEffect, useRef, type ReactNode } from 'react'

/** Shared keyboard/focus behaviour for the phone menu and clinical search. */
export function Dialog({ title, close, className = '', children }: { title: string; close(): void; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(close)
  closeRef.current = close
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = ref.current!
    const focusable = () => [...panel.querySelectorAll<HTMLElement>('a[href], button, input, select, [tabindex="0"]')].filter((n) => !n.hasAttribute('disabled'))
    ;(panel.querySelector<HTMLElement>('[data-autofocus]') || focusable()[0] || panel).focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return }
      if (event.key !== 'Tab') return
      const nodes = focusable()
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (!first) { event.preventDefault(); panel.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('keydown', keydown)
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return <div className="dialog-backdrop" onClick={(event) => { if (event.target === event.currentTarget) close() }}>
    <div className={`dialog ${className}`} ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
      <div className="dialog-header"><h2>{title}</h2><button type="button" className="icon-btn" onClick={close} aria-label={`Close ${title.toLowerCase()}`}>×</button></div>
      {children}
    </div>
  </div>
}
