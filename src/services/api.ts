import { environment } from "@/config/environment";
import ErrorEnum from "@/constants/errorEnum";
import { ErrorResponse } from "@/models/ErrorResponse";
import axios from "axios";
import Toast from "react-native-toast-message";

export const api = axios.create({
    baseURL: environment.apiBaseUrl,
    timeout: 3000,
});

api.interceptors.response.use(
    response => response,

    error => {
        showApiError(error);

        return Promise.reject(error);
    }
);

function showApiError(error: unknown) {

    if (!axios.isAxiosError<ErrorResponse>(error)) {
        return;
    }

    const response = error.response;

    if (!response?.data?.errors?.length) {

        Toast.show({
            type: ErrorEnum.ERROR.toastType,
            text1: ErrorEnum.ERROR.description,
            text2: "Ocorreu um erro desconhecido",
        });

        return;
    }

    const apiError = response.data.errors[0];

    Toast.show({
        type: ErrorEnum[apiError.level].toastType,
        text1: ErrorEnum[apiError.level].description,
        text2: `${response.status} - ${apiError.description}`,
    });
}