import { createContext, useContext, type PropsWithChildren } from 'react'

export type Theme = 'light' | 'dark'

const ThemeContext = createContext<Theme>('light')

export function ThemeProvider({ children }: PropsWithChildren) {
  return <ThemeContext.Provider value="light">{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
