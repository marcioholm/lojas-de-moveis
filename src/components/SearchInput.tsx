'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'

export function SearchInput({ placeholder = 'Buscar...' }: { placeholder?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="search-bar">
      <Search size={16} />
      <input
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
