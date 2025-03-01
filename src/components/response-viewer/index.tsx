import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface ResponseViewerProps {
  response: string;
  isLoading: boolean;
}

export function ResponseViewer({ response, isLoading }: ResponseViewerProps) {
  // Function to format and syntax highlight JSON
  const formatResponse = (json: string) => {
    if (!json) return null;

    try {
      // Parse and re-stringify to ensure proper formatting
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return json;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Response</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : response ? (
          <pre className="font-mono text-sm whitespace-pre-wrap">
            {formatResponse(response)}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No response yet. Run a query to see results.
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
