import './App.css'
import { setupConsoleLogForwarding } from './lib/log'
import { QueryBoxApp } from './query-box-app'
setupConsoleLogForwarding()

function App() {
  return <QueryBoxApp />
}

export default App
