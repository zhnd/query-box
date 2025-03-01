import "@/components/query-editor/userWorker";
import { useService } from "./use-service";

export function QueryEditor() {
  const service = useService();
  return (
    <div
      className="w-full h-full"
      ref={service.editorContainerElementRef}
    ></div>
  );
}
