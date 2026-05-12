import { createContext, useContext } from "react"

const ThemeContext = createContext(null)

export function ThemeProvider({ activeTheme, children }) {
  return (
    <ThemeContext.Provider value={activeTheme}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}