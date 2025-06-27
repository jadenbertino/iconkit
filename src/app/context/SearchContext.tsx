'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

type SearchParams = {
  text: string
}

type SearchContextType = {
  search: SearchParams
  setSearch: (search: SearchParams) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<SearchParams>({ text: '' })

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
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
