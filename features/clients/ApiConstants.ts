/**
 * ApiConstants - Shared API constants for clients
 */
export const ApiConstants = {
  paths: {
    entries: '/entries',
    invalidEndpoint: '/invalid-endpoint',
  },
  status: {
    ok: 200,
    validErrorStatuses: [400, 404, 405] as const,
  },
  limits: {
    defaultResponseTimeMs: 2000,
    maxResponseBytes: 1_000_000,
  },
  headers: {
    jsonContentType: 'application/json',
  },
} as const;

export type ApiStatusCode = typeof ApiConstants.status.validErrorStatuses[number];
