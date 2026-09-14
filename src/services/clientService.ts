import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { api } from "./api";


export class ClientService {


    static async registerClient(request: ClientRegisterRequest, tableId: string) {

        if (!tableId) {
            return;
        }

        if (request.name.trim().length === 0) {
            console.error("Nome não pode ser vazio");
            return;
        }

        try {
            const response = await api.post(`/table/${tableId}/clients`, request)

            if (response.status !== 201) {
                throw new Error(`Falha ao criar cliente: code: ${response.status}, data: ${response.data}`);
            }

            return response.data;
        }
        catch (error) {
            console.error("Erro ao registrar cliente:", error);
        }
    }
}