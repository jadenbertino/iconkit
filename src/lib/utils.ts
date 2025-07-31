import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Define custom background utilities that shouldn't conflict with each other
      'bg-context': ['bg-surface', 'bg-overlay', 'bg-inverse', 'bg-canvas'],
      'bg-state': ['bg-hover'],
      'context': ['context-light', 'context-dark'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}

export function capitalize(str: string) {
  const words = str.split(' ')
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
