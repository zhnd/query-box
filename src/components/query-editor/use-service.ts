import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { getIntrospectionQuery, IntrospectionQuery } from "graphql";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect, useRef } from "react";

export function useService() {
  const editorContainerElementRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const initializingRef = useRef(false);

  const init = async () => {
    if (editorInstanceRef.current || initializingRef.current) return;
    initializingRef.current = true;

    const editorInstance = monaco.editor.create(
      editorContainerElementRef.current!,
      {
        value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
          "\n"
        ),
        language: "typescript",
      }
    );

    editorInstanceRef.current = editorInstance;
    initializingRef.current = false;
  };

  useEffect(() => {
    init();
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
        editorInstanceRef.current = null;
        initializingRef.current = false;
      }
    };
  }, []);

  return { editorContainerElementRef };
}

const fetcher = createGraphiQLFetcher({ url: "" });

async function getSchema(): Promise<IntrospectionQuery> {
  const data = await fetcher({
    query: getIntrospectionQuery(),
    operationName: "IntrospectionQuery",
  });
  const introspectionJSON =
    "data" in data && (data.data as unknown as IntrospectionQuery);

  if (!introspectionJSON) {
    throw new Error(
      "This demo does not support subscriptions or HTTP multipart yet"
    );
  }
  return introspectionJSON;
}
