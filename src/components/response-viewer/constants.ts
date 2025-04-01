export enum ResponseViewType {
  BODY = 'body',
  HEADERS = 'headers',
}

export const viewLabels: Record<ResponseViewType, string> = {
  [ResponseViewType.BODY]: 'Response Body',
  [ResponseViewType.HEADERS]: 'Response Headers',
}

export const ViewTypeMenuItems = [
  {
    label: viewLabels[ResponseViewType.BODY],
    value: ResponseViewType.BODY,
  },
  {
    label: viewLabels[ResponseViewType.HEADERS],
    value: ResponseViewType.HEADERS,
  },
]
