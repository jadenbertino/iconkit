import { useSearch } from '@/context/SearchContext'
import { useCallback, useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

/**
 * Hook for managing search input with debounced updates to search context
 * and immediate updates on form submission.
 *
 * @param delayMs - Debounce delay in milliseconds for typing (default: 300)
 * @param onSubmitCallback - Optional callback fired when form is submitted with search text
 *
 * @returns Object containing:
 *   - searchText: Current search input value
 *   - setSearchText: Function to update search input value
 *   - onSubmit: Form submission handler that bypasses debouncing
 *
 * @example
 * ```tsx
 * const { searchText, setSearchText, onSubmit } = useDebouncedSearch(300, (searchText) => {
 *   router.push(`/search?q=${searchText}`)
 * })
 *
 * return (
 *   <form onSubmit={onSubmit}>
 *     <input
 *       value={searchText}
 *       onChange={(e) => setSearchText(e.target.value)}
 *     />
 *     <button type="submit">Search</button>
 *   </form>
 * )
 * ```
 */
export function useDebouncedSearch(
  delayMs: number = 300,
  onSubmitCallback?: (searchText: string) => void,
) {
  const { setSearch, search } = useSearch()
  const [searchText, setSearchText] = useState(search.text)

  const debouncedSetSearch = useDebounceCallback(
    useCallback(
      (text: string) => {
        setSearch((prev) => ({ ...prev, text, page: 1 }))
      },
      [setSearch],
    ),
    delayMs,
  )

  useEffect(() => {
    debouncedSetSearch(searchText)
  }, [searchText, debouncedSetSearch])

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedText = searchText.trim()

      if (trimmedText) {
        // Immediately update search context (bypass debouncing)
        setSearch((prev) => ({ ...prev, text: trimmedText, page: 1 }))
        onSubmitCallback?.(trimmedText)
      }
    },
    [searchText, setSearch, onSubmitCallback],
  )

  return {
    searchText,
    setSearchText,
    onSubmit,
  }
}
