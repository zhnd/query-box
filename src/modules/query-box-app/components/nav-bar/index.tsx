import { navbarList } from './constants'

export function Navbar() {
  return (
    <nav className="h-screen relative bg-gray-100 border-alpha-200 transition-all w-56 p-2">
      <ul className="flex flex-col gap-2">
        {navbarList.map((item) => (
          <li
            key={item.key}
            className="flex items-center hover:rounded-md p-2 hover:bg-gray-200 cursor-pointer"
          >
            <span className="px-2">{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <button className="absolute bg-gray-200 inset-y-0 -right-px z-30 w-[1px] hover:w-[3px] cursor-w-resize after:absolute after:-inset-x-1.5 after:inset-y-0 after:opacity-20 hover:bg-gray-300" />
    </nav>
  )
}
