import { useTitleBarService } from './use-service'

export function TitleBar() {
  const service = useTitleBarService()

  return (
    <div
      className="h-[28px] select-none flex items-center overflow-hidden"
      data-tauri-drag-region
    >
      {service.currentPlatform === 'macos' ? (
        <div className="flex items-center w-full">
          <div className="flex items-center gap-2 ml-2">
            <button
              className={`w-3 h-3 rounded-full ${service.isWindowFocused ? 'bg-[#ff5f57]' : 'bg-gray-400'} flex items-center justify-center relative  focus:outline-none`}
              onClick={close}
              title="Close"
              onMouseEnter={() => service.setIsHovering('close')}
              onMouseLeave={() => service.setIsHovering(null)}
            >
              {service.isHovering === 'close' && (
                <span className="text-[9px] leading-none text-[rgba(0,0,0,0.55)] absolute">
                  ×
                </span>
              )}
            </button>
            <button
              className={`w-3 h-3 rounded-full ${service.isWindowFocused ? 'bg-[#ffbd2e]' : 'bg-gray-400'} flex items-center justify-center relative  focus:outline-none`}
              onClick={service.minimize}
              title="Minimize"
              onMouseEnter={() => service.setIsHovering('minimize')}
              onMouseLeave={() => service.setIsHovering(null)}
            >
              {service.isHovering === 'minimize' && (
                <span className="text-[9px] leading-none text-[rgba(0,0,0,0.55)] absolute">
                  −
                </span>
              )}
            </button>
            <button
              className={`w-3 h-3 rounded-full ${service.isWindowFocused ? 'bg-[#28c93f]' : 'bg-gray-400'} flex items-center justify-center relative  focus:outline-none`}
              onClick={service.maximize}
              title="Maximize"
              onMouseEnter={() => service.setIsHovering('maximize')}
              onMouseLeave={() => service.setIsHovering(null)}
            >
              {service.isHovering === 'maximize' && (
                <span className="text-[9px] leading-none text-[rgba(0,0,0,0.55)] absolute">
                  +
                </span>
              )}
            </button>
          </div>

          <div
            className="flex-1 text-center text-xs text-gray-300"
            data-tauri-drag-region
          >
            query-box
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-gray-300 ml-2" data-tauri-drag-region>
            query-box
          </div>

          <div className="flex">
            <button
              className="w-[46px] h-[28px] flex items-center justify-center hover:bg-gray-700 focus:outline-none"
              onClick={service.minimize}
              title="Minimize"
            >
              <svg width="10" height="1" viewBox="0 0 10 1">
                <path fill="currentColor" d="M0 0h10v1H0z" />
              </svg>
            </button>
            <button
              className="w-[46px] h-[28px] flex items-center justify-center hover:bg-gray-700 focus:outline-none"
              onClick={service.maximize}
              title="Maximize"
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path fill="currentColor" d="M0 0v10h10V0H0zm1 1h8v8H1V1z" />
              </svg>
            </button>
            <button
              className="w-[46px] h-[28px] flex items-center justify-center hover:bg-[#e81123] focus:outline-none"
              onClick={close}
              title="Close"
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path
                  fill="currentColor"
                  d="M6.41 5l3.29-3.29a1 1 0 0 0-1.41-1.41L5 3.59 1.71.3A1 1 0 0 0 .3 1.71L3.59 5 .3 8.29a1 1 0 0 0 1.41 1.41L5 6.41l3.29 3.29a1 1 0 0 0 1.41-1.41L6.41 5z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
