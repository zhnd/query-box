import { ModeToggle } from "@/components/mode-toggle";
import { Sidebar } from "@/components/sidebar";
import { TabsContainer } from "@/components/tabs-container";
import { Button } from "@/components/ui/button";
import { Endpoint, HistoryItem, Tab } from "@/types";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";
import { useState } from "react";

export function QueryBoxApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    {
      id: "1",
      name: "GitHub API",
      url: "https://api.github.com/graphql",
      token: "ghp_example123456789",
    },
    {
      id: "2",
      name: "Shopify API",
      url: "https://shopify.dev/graphql",
      token: "shpat_example123456789",
    },
    {
      id: "3",
      name: "Contentful API",
      url: "https://graphql.contentful.com/content/v1/spaces/example",
      token: "example123456789",
    },
  ]);

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      name: "GitHub API",
      endpointId: "1",
      query: "query { viewer { login } }",
      variables: "{}",
      isActive: true,
    },
  ]);

  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "1",
      endpointId: "1",
      query: "query { viewer { login } }",
      variables: "{}",
      response: '{ "data": { "viewer": { "login": "example-user" } } }',
      timestamp: new Date().toISOString(),
    },
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addEndpoint = (endpoint: Endpoint) => {
    setEndpoints([...endpoints, endpoint]);
  };

  const removeEndpoint = (id: string) => {
    setEndpoints(endpoints.filter((endpoint) => endpoint.id !== id));
  };

  const updateEndpoint = (id: string, endpoint: Partial<Endpoint>) => {
    setEndpoints(
      endpoints.map((e) => (e.id === id ? { ...e, ...endpoint } : e))
    );
  };

  const addTab = (tab: Tab) => {
    setTabs(tabs.map((t) => ({ ...t, isActive: false })));
    setTabs((prev) => [...prev, { ...tab, isActive: true }]);
  };

  const closeTab = (id: string) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === id);
    const newTabs = tabs.filter((tab) => tab.id !== id);

    if (tabs[tabIndex].isActive && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].isActive = true;
    }

    setTabs(newTabs);
  };

  const setActiveTab = (id: string) => {
    setTabs(tabs.map((tab) => ({ ...tab, isActive: tab.id === id })));
  };

  const updateTab = (id: string, tabData: Partial<Tab>) => {
    setTabs(tabs.map((tab) => (tab.id === id ? { ...tab, ...tabData } : tab)));
  };

  const addHistoryItem = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {isSidebarOpen && (
        <Sidebar
          endpoints={endpoints}
          onAddEndpoint={addEndpoint}
          onRemoveEndpoint={removeEndpoint}
          onUpdateEndpoint={updateEndpoint}
          onSelectEndpoint={(id) => {
            const endpoint = endpoints.find((e) => e.id === id);
            if (endpoint) {
              const newTabId = crypto.randomUUID();
              addTab({
                id: newTabId,
                name: endpoint.name,
                endpointId: endpoint.id,
                query: "",
                variables: "{}",
                isActive: true,
              });
            }
          }}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b p-2">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2"
            >
              {isSidebarOpen ? (
                <PanelLeftIcon size={18} />
              ) : (
                <PanelRightIcon size={18} />
              )}
            </Button>
            <h1 className="text-xl font-bold">QueryBox</h1>
          </div>
          <ModeToggle />
        </div>

        <TabsContainer
          tabs={tabs}
          endpoints={endpoints}
          history={history}
          onCloseTab={closeTab}
          onSelectTab={setActiveTab}
          onUpdateTab={updateTab}
          onAddHistoryItem={addHistoryItem}
          onClearHistory={clearHistory}
        />
      </div>
    </div>
  );
}
