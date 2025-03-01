import { HistoryPanel } from "@/components/history-panel";
import { ResponseViewer } from "@/components/response-viewer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Endpoint, HistoryItem, Tab } from "@/types";
import { ClockIcon, PlayIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { QueryEditor } from "../query-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

interface TabsContainerProps {
  tabs: Tab[];
  endpoints: Endpoint[];
  history: HistoryItem[];
  onCloseTab: (id: string) => void;
  onSelectTab: (id: string) => void;
  onUpdateTab: (id: string, tab: Partial<Tab>) => void;
  onAddHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export function TabsContainer({
  tabs,
  endpoints,
  history,
  onCloseTab,
  onSelectTab,
  onUpdateTab,
  onAddHistoryItem,
  onClearHistory,
}: TabsContainerProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const activeTab = tabs.find((tab) => tab.isActive);
  const activeEndpoint = activeTab
    ? endpoints.find((endpoint) => endpoint.id === activeTab.endpointId)
    : null;

  const handleRunQuery = async () => {
    if (!activeTab || !activeEndpoint) return;

    // Set loading state
    onUpdateTab(activeTab.id, { isLoading: true });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response
      const mockResponse = JSON.stringify(
        {
          data: {
            viewer: {
              login: "example-user",
              name: "Example User",
              repositories: {
                totalCount: 42,
                nodes: [
                  { name: "repo1", stargazerCount: 123 },
                  { name: "repo2", stargazerCount: 456 },
                ],
              },
            },
          },
        },
        null,
        2
      );

      // Update tab with response
      onUpdateTab(activeTab.id, {
        response: mockResponse,
        isLoading: false,
      });

      // Add to history
      onAddHistoryItem({
        id: crypto.randomUUID(),
        endpointId: activeTab.endpointId,
        query: activeTab.query,
        variables: activeTab.variables,
        response: mockResponse,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Handle error
      onUpdateTab(activeTab.id, {
        response: JSON.stringify({ error: "An error occurred" }, null, 2),
        isLoading: false,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="flex items-center">
          <Tabs value={activeTab?.id} className="flex-1">
            <TabsList className="bg-transparent h-auto p-0">
              {tabs.map((tab) => (
                <div key={tab.id} className="flex items-center">
                  <TabsTrigger
                    value={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`rounded-none border-b-2 border-transparent px-4 py-2 ${
                      tab.isActive ? "border-primary" : ""
                    }`}
                  >
                    {tab.name}
                  </TabsTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => onCloseTab(tab.id)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center mr-2">
            <Button
              variant={isHistoryOpen ? "default" : "outline"}
              size="sm"
              className="mr-2"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            >
              <ClockIcon className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button
              size="sm"
              onClick={handleRunQuery}
              disabled={!activeTab || activeTab.isLoading}
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Run Query
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {isHistoryOpen && (
          <HistoryPanel
            history={history}
            onSelectHistoryItem={(item) => {
              if (activeTab) {
                onUpdateTab(activeTab.id, {
                  query: item.query,
                  variables: item.variables,
                  response: item.response,
                });
              }
              setIsHistoryOpen(false);
            }}
            onClearHistory={onClearHistory}
          />
        )}

        <div
          className={`flex flex-col flex-1 ${
            isHistoryOpen ? "w-2/3" : "w-full"
          }`}
        >
          {activeTab ? (
            <ResizablePanelGroup direction={"horizontal"}>
              <ResizablePanel defaultSize={50} minSize={30}>
                <QueryEditor
                  query={activeTab.query}
                  variables={activeTab.variables}
                  endpoint={activeEndpoint}
                  onQueryChange={(query) =>
                    onUpdateTab(activeTab.id, { query })
                  }
                  onVariablesChange={(variables) =>
                    onUpdateTab(activeTab.id, { variables })
                  }
                />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50} minSize={30}>
                <ResponseViewer
                  response={activeTab.response || ""}
                  isLoading={activeTab.isLoading || false}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No active tab. Select an endpoint from the sidebar to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
