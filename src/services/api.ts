import { environment } from "@/config/environment";
import { ApiException } from "@/exceptions/ApiException";
import { ErrorResponse } from "@/models/ErrorResponse";
import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: environment.apiBaseUrl,
});

export function getApiError(error: unknown): ApiException | null {

    if (!axios.isAxiosError(error)) {
        return null;
    }

    const axiosError = error as AxiosError<ErrorResponse>;

    const response = axiosError.response;

    if (!response?.data?.errors) {
        return null;
    }

    return new ApiException(
        response.data.errors,
        response.status
    );
}