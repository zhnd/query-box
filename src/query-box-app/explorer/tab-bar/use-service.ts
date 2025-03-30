import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'react'

export interface Tab {
  id: string
  name: string
}

export const useTabBarService = () => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('1')
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  const addTab = () => {
    const newId = nanoid()
    const newTab: Tab = {
      id: newId,
      name: `Query ${tabs.length + 1}`,
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newId)
  }

  useEffect(() => {
    if (tabs.length === 0) {
      addTab()
    }
  }, [tabs])

  const removeTab = (id: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== id)
    setTabs(newTabs)

    if (activeTabId === id && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id)
    }
  }

  const closeAllTabs = () => {
    setTabs([])
    setActiveTabId('')
  }

  useEffect(() => {
    if (tabsContainerRef.current && activeTabId) {
      const activeTabElement = tabsContainerRef.current.querySelector(
        `[data-tab-id="${activeTabId}"]`
      )
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
  }, [activeTabId])

  const handleActiveTabChange = (id: string) => {
    setActiveTabId(id)
  }

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    closeAllTabs,
    setActiveTabId,
    tabsContainerRef,
    handleActiveTabChange,
  }
}
