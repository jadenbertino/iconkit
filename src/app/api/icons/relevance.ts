import type { Icon } from '@/lib/schemas/database'

interface ScoringWeights {
  /** Score for exact name match (e.g., searching "user" finds icon named "user") */
  exactName: number
  /** Score when icon name starts with search term (e.g., "user" finds "user-profile") */
  startsWith: number
  /** Score for exact tag match (e.g., searching "navigation" finds tag "navigation") */
  exactTag: number
  /** Score when icon name contains search term (e.g., "home" finds "smartphone") */
  contains: number
}

/** Balanced scoring weights for general-purpose icon search */
const DEFAULT_WEIGHTS: ScoringWeights = {
  exactName: 100,
  startsWith: 80,
  exactTag: 60,
  contains: 40,
}

/** Strict scoring that heavily favors exact matches and penalizes partial matches */
const STRICT_WEIGHTS: ScoringWeights = {
  exactName: 100,
  startsWith: 90,
  exactTag: 70,
  contains: 10,
}

/** Fuzzy scoring that is more generous with partial matches and broader results */
const FUZZY_WEIGHTS: ScoringWeights = {
  exactName: 100,
  startsWith: 70,
  exactTag: 50,
  contains: 60,
}

const WEIGHT_PRESETS = {
  default: DEFAULT_WEIGHTS,
  strict: STRICT_WEIGHTS,
  fuzzy: FUZZY_WEIGHTS,
} as const

type WeightPreset = keyof typeof WEIGHT_PRESETS

function sortByRelevance<T extends Icon>(
  icons: T[],
  terms: string[],
  preset: WeightPreset = 'default',
): Array<T & { relevanceScore: number }> {
  return icons
    .map((icon) => ({
      ...icon,
      relevanceScore: calculateRelevanceScore(icon, terms, preset),
    }))
    .sort((a, b) => {
      // Primary sort: relevance score (descending)
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      // Secondary sort: alphabetical (ascending)
      return a.name.localeCompare(b.name)
    })
}

function calculateRelevanceScore(
  icon: Icon,
  terms: string[],
  preset: WeightPreset = 'default',
): number {
  const weights = WEIGHT_PRESETS[preset]
  return calculateWeightedScore(icon, terms, weights)
}

function calculateWeightedScore(
  icon: Icon,
  terms: string[],
  weights: ScoringWeights = DEFAULT_WEIGHTS,
): number {
  let score = 0
  const lowerName = icon.name.toLowerCase()

  terms.forEach((term) => {
    const lowerTerm = term.toLowerCase()

    // Name matching - in priority order
    if (lowerName === lowerTerm) {
      score += weights.exactName
    } else if (lowerName.startsWith(lowerTerm)) {
      score += weights.startsWith
    } else if (lowerName.includes(lowerTerm)) {
      score += weights.contains
    }

    // Tag matching - only exact matches
    if (icon.tags?.includes(term)) {
      score += weights.exactTag
    }
  })

  return Math.max(0, score) // Ensure non-negative scores
}

// Debug helper for development
function getMatchTypes(icon: Icon, terms: string[]): string[] {
  const matches: string[] = []
  const lowerName = icon.name.toLowerCase()

  terms.forEach((term) => {
    const lowerTerm = term.toLowerCase()

    if (lowerName === lowerTerm) {
      matches.push('exact-name')
    } else if (lowerName.startsWith(lowerTerm)) {
      matches.push('starts-with')
    } else if (lowerName.includes(lowerTerm)) {
      matches.push('contains')
    }

    if (icon.tags?.includes(term)) {
      matches.push('exact-tag')
    }
  })

  return matches
}

export { getMatchTypes, sortByRelevance, WEIGHT_PRESETS }
export type { ScoringWeights, WeightPreset }
