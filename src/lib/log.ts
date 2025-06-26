import { debug, error, info, trace, warn } from '@tauri-apps/plugin-log'

// Store original console.error before any overrides
const originalConsoleError = console.error

function forwardConsole(
  fnName: 'log' | 'debug' | 'info' | 'warn' | 'error',
  logger: (message: string) => Promise<void>
) {
  const original = console[fnName]

  console[fnName] = (...args: unknown[]) => {
    original(...args)

    const message = args
      .map((arg) => {
        if (typeof arg === 'string') return arg
        if (arg instanceof Error) {
          return JSON.stringify({
            name: arg.name,
            message: arg.message,
            stack: arg.stack,
          })
        }
        try {
          return JSON.stringify(arg)
        } catch {
          return '[Unserializable]'
        }
      })
      .join(' ')

    logger(message).catch(originalConsoleError)
  }
}
export function setupConsoleLogForwarding() {
  if (!PRODUCTION) return
  forwardConsole('log', trace)
  forwardConsole('debug', debug)
  forwardConsole('info', info)
  forwardConsole('warn', warn)
  forwardConsole('error', error)
}
