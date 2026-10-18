export type ApiErrorKind =
  | 'http_error'
  | 'network_error'
  | 'timeout'
  | 'cancel'
  | 'parse_error'
  | 'contract_error';

export type ApiError = {
  kind: ApiErrorKind;
  message: string;
  status: number | null;
  requestId: string | null;
};

export function apiError(
  kind: ApiErrorKind,
  message: string,
  status: number | null = null,
  requestId: string | null = null,
): ApiError {
  return { kind, message, status, requestId };
}

export function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'kind' in value && 'requestId' in value;
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  return apiError('network_error', error instanceof Error ? error.message : String(error));
}
