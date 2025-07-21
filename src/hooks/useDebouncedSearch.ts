import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useSearch } from '@/context/SearchContext'

export function useDebouncedSearch(delayMs: number = 300) {
  const { setSearch, search } = useSearch()
  const [searchText, setSearchText] = useState(search.text)

  const debouncedSetSearch = useDebounceCallback((text: string) => {
    setSearch((prev) => ({ ...prev, text, page: 1 }))
  }, delayMs)

  useEffect(() => {
    debouncedSetSearch(searchText)
  }, [searchText, debouncedSetSearch])

  return {
    searchText,
    setSearchText,
  }
}
