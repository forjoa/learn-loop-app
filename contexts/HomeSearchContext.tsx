import { createContext, useContext } from 'react'

export const HomeSearchContext = createContext<{
    query: string
    setQuery: (query: string) => void
}>({
    query: '',
    setQuery: () => {},
})

export function useHomeSearch() {
    return useContext(HomeSearchContext)
}
