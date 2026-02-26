import { useEffect, useCallback } from 'react'

export const useKeyboardNavigation = (
  onEscape?: () => void,
  onEnter?: () => void,
  onSpace?: () => void
) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault()
          onEscape()
        }
        break
      case 'Enter':
        if (onEnter) {
          event.preventDefault()
          onEnter()
        }
        break
      case ' ':
        if (onSpace) {
          event.preventDefault()
          onSpace()
        }
        break
    }
  }, [onEscape, onEnter, onSpace])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

export const useFocusManagement = () => {
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus()
            e.preventDefault()
          }
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstFocusable?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  return { trapFocus }
}
