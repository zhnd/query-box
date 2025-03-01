import type { Endpoint } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  EditIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  endpoints: Endpoint[];
  onAddEndpoint: (endpoint: Endpoint) => void;
  onRemoveEndpoint: (id: string) => void;
  onUpdateEndpoint: (id: string, endpoint: Partial<Endpoint>) => void;
  onSelectEndpoint: (id: string) => void;
}

export function Sidebar({
  endpoints,
  onAddEndpoint,
  onRemoveEndpoint,
  onUpdateEndpoint,
  onSelectEndpoint,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState<Partial<Endpoint>>({
    name: "",
    url: "",
    token: "",
  });
  const [editingEndpoint, setEditingEndpoint] = useState<string | null>(null);

  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEndpoint = () => {
    if (newEndpoint.name && newEndpoint.url) {
      onAddEndpoint({
        id: crypto.randomUUID(),
        name: newEndpoint.name,
        url: newEndpoint.url,
        token: newEndpoint.token || "",
      });
      setNewEndpoint({ name: "", url: "", token: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateEndpoint = (id: string) => {
    if (editingEndpoint === id) {
      setEditingEndpoint(null);
    }
  };

  return (
    <div className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-2">GraphQL Endpoints</h2>
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search endpoints..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredEndpoints.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">
              No endpoints found
            </p>
          ) : (
            filteredEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="mb-1">
                {editingEndpoint === endpoint.id ? (
                  <div className="p-2 rounded-md border">
                    <Input
                      className="mb-2"
                      placeholder="Name"
                      value={endpoint.name}
                      onChange={(e) =>
                        onUpdateEndpoint(endpoint.id, { name: e.target.value })
                      }
                    />
                    <Input
                      className="mb-2"
                      placeholder="URL"
                      value={endpoint.url}
                      onChange={(e) =>
                        onUpdateEndpoint(endpoint.id, { url: e.target.value })
                      }
                    />
                    <Input
                      className="mb-2"
                      placeholder="Token (optional)"
                      value={endpoint.token}
                      onChange={(e) =>
                        onUpdateEndpoint(endpoint.id, { token: e.target.value })
                      }
                      type="password"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEndpoint(null)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateEndpoint(endpoint.id)}
                      >
                        <SaveIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer group"
                    onClick={() => onSelectEndpoint(endpoint.id)}
                  >
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">
                        {endpoint.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {endpoint.url}
                      </div>
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEndpoint(endpoint.id);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveEndpoint(endpoint.id);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Endpoint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add GraphQL Endpoint</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="GitHub API"
                  value={newEndpoint.name}
                  onChange={(e) =>
                    setNewEndpoint({ ...newEndpoint, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://api.github.com/graphql"
                  value={newEndpoint.url}
                  onChange={(e) =>
                    setNewEndpoint({ ...newEndpoint, url: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="token">API Token (optional)</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Your API token"
                  value={newEndpoint.token}
                  onChange={(e) =>
                    setNewEndpoint({ ...newEndpoint, token: e.target.value })
                  }
                />
              </div>
            </div>
            <Button onClick={handleAddEndpoint}>Add Endpoint</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
