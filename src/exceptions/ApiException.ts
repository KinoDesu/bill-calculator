import { ApiError } from "@/models/ErrorResponse";

export class ApiException extends Error {
    public readonly errors: ApiError[];
    public readonly status?: number;

    constructor(
        errors: ApiError[],
        status?: number
    ) {
        super(errors[0]?.message ?? "Erro desconhecido");

        this.name = "ApiException";
        this.errors = errors;
        this.status = status;
    }
}