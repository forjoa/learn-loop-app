import { createContext, useContext } from 'react'

export const TabBarContext = createContext<{
    setIsTabBarHidden: (hidden: boolean) => void
}>({
    setIsTabBarHidden: () => {},
})

export function useTabBarVisibility() {
    return useContext(TabBarContext)
}
