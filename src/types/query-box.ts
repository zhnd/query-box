export type Endpoint = {
  id: string;
  name: string;
  url: string;
  token: string;
};

export type Tab = {
  id: string;
  name: string;
  endpointId: string;
  query: string;
  variables: string;
  isActive: boolean;
  response?: string;
  isLoading?: boolean;
};

export type HistoryItem = {
  id: string;
  endpointId: string;
  query: string;
  variables: string;
  response: string;
  timestamp: string;
};
