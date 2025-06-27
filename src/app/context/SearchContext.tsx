'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

type SearchParams = {
  text: string
  page: number
}

type SearchContextType = {
  search: SearchParams
  setSearch: (search: SearchParams) => void
  nextPage: () => void
  prevPage: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<SearchParams>({ text: '', page: 1 })

  const nextPage = () => {
    setSearch((prev) => ({ ...prev, page: prev.page + 1 }))
  }

  const prevPage = () => {
    setSearch((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
  }

  return (
    <SearchContext.Provider value={{ search, setSearch, nextPage, prevPage }}>
      {children}
    </SearchContext.Provider>
  )
}

function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export { SearchProvider, useSearch }
export type { SearchParams }
