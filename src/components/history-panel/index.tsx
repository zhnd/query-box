import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { HistoryItem } from "@/types";
import { ClockIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export function HistoryPanel({
  history,
  onSelectHistoryItem,
  onClearHistory,
}: HistoryPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((item) =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="w-1/3 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">History</h3>
          <Button variant="outline" size="sm" onClick={onClearHistory}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <ClockIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {history.length === 0
                ? "No history yet. Run some queries to see them here."
                : "No matching history items found."}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 border rounded-md mb-2 hover:bg-accent cursor-pointer"
                onClick={() => onSelectHistoryItem(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium truncate">
                    {item.query.slice(0, 30).replace(/\s+/g, " ")}
                    {item.query.length > 30 ? "..." : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {item.response.slice(0, 50).replace(/\s+/g, " ")}
                  {item.response.length > 50 ? "..." : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
