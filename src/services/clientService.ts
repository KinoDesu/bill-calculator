import { Client } from "@/models/Client";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { api, getApiError } from "./api";

export class ClientService {

    static async updateClient(
        request: ClientRegisterRequest,
        tableId: string
    ) {
        if (!tableId) {
            return;
        }

        if (request.name.trim().length === 0) {
            console.error("Nome não pode ser vazio");
            return;
        }

        try {
            const response = await api.post(
                `/table/${tableId}/clients`,
                request
            );

            return response.data;

        } catch (error) {

            const apiError = getApiError(error);

            if (apiError) {
                console.error("Status:", apiError.status);

                apiError.errors.forEach(error => {
                    console.error("Code:", error.code);
                    console.error("Message:", error.message);
                    console.error("Level:", error.level);
                    console.error("Description:", error.description);
                });
            }

            throw error;
        }
    }


    static async registerClient(
        request: ClientRegisterRequest,
        tableId: string
    ) {
        if (!tableId) {
            return;
        }

        if (request.name.trim().length === 0) {
            console.error("Nome não pode ser vazio");
            return;
        }

        try {
            const response = await api.post(
                `/table/${tableId}/clients`,
                request
            );

            return response.data;

        } catch (error) {

            const apiError = getApiError(error);

            if (apiError) {
                console.error("Status:", apiError.status);

                apiError.errors.forEach(error => {
                    console.error("Code:", error.code);
                    console.error("Message:", error.message);
                    console.error("Level:", error.level);
                    console.error("Description:", error.description);
                });
            }

            throw error;
        }
    }


    static async getTableClients(tableId: string): Promise<Client[]> {
        try {
            const response = await api.get(
                `/table/${tableId}/clients`
            );

            return response.data;

        } catch (error) {

            const apiError = getApiError(error);

            if (apiError) {
                console.error("Status:", apiError.status);

                apiError.errors.forEach(error => {
                    console.error("Code:", error.code);
                    console.error("Message:", error.message);
                    console.error("Level:", error.level);
                    console.error("Description:", error.description);
                });
            }

            throw error;
        }
    }
}