import './App.css'
import { QueryBoxApp } from './modules/query-box-app'
import { ThemeProvider } from './providers'

function App() {
  return (
    <ThemeProvider storageKey="ui-theme">
      <QueryBoxApp />
    </ThemeProvider>
  )
}

export default App
