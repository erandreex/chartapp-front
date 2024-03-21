import { ModelResponseError } from './ModelResponseError';

export interface ModelResponse<T> {
    ok: boolean;
    code: number;
    status: string;
    message: string;
    error: ModelResponseError;
    response: T;
}
