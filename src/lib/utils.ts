import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

type AdditionalClassGroupIds = 'bg-context' | 'bg-state' | 'context'
type AdditionalThemeGroupIds = never

const customTwMerge = extendTailwindMerge<
  AdditionalClassGroupIds,
  AdditionalThemeGroupIds
>({
  extend: {
    classGroups: {
      // Define custom background utilities that shouldn't conflict with each other
      'bg-context': ['bg-surface', 'bg-overlay', 'bg-inverse', 'bg-canvas'],
      'bg-state': ['bg-hover'],
      context: ['context-light', 'context-dark'],
    },
    conflictingClassGroups: {
      // Ensure custom background classes conflict with each other
      'bg-context': ['bg-state'],
      'bg-state': ['bg-context'],
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
