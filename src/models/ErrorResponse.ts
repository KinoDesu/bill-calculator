export type ErrorLevel = "ERROR" | "FATAL" | "INFO" | "WARNING";

export interface ApiError {
    code: string;
    message: string;
    level: ErrorLevel;
    description: string;
}

export interface ErrorResponse {
    errors: ApiError[];
}