import { CustomFunctionList } from './list'
import { SearchFunction } from './search'

export function CustomFunction() {
  return (
    <div className="function">
      <SearchFunction />
      <CustomFunctionList />
    </div>
  )
}
