import { showError } from "@/components/CustomToast";
import ErrorEnum from "@/constants/errorEnum";
import { Client } from "@/models/Client";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { api } from "./api";

export class ClientService {
    static async getClientById(clientId: string) {
        const response = await api.get(
            `/client/${clientId}`
        );

        return response.data;
    }

    static async updateClient(
        request: ClientRegisterRequest,
        tableId: string
    ) {
        if (!tableId) {
            return;
        }

        if (request.name.trim().length === 0) {
            showError(
                ErrorEnum.WARNING.description,
                "Nome não pode ser vazio"
            );
            return;
        }

        const response = await api.post(
            `/table/${tableId}/clients`,
            request
        );

        return response.data;
    }


    static async registerClient(
        request: ClientRegisterRequest,
        tableId: string
    ) {
        if (!tableId) {
            return;
        }

        if (request.name.trim().length === 0) {
            showError(
                ErrorEnum.WARNING.description,
                "Nome não pode ser vazio"
            );
            return;
        }

        const response = await api.post(
            `/table/${tableId}/clients`,
            request
        );

        return response.data;

    }


    static async getTableClients(tableId: string): Promise<Client[]> {
        const response = await api.get(
            `/table/${tableId}/clients`
        );

        return response.data;
    }
}