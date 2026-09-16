import { Order } from "@/models/Order";
import { OrderRegisterRequest } from "@/models/OrderRegisterRequest";
import { api, getApiError } from "./api";

export class OrderService {
    static async registerOrder(request: OrderRegisterRequest, tableId: string) {
        if (!tableId) {
            return;
        }

        if (request.name.trim().length === 0) {
            console.error("Nome não pode ser vazio");
            return;
        }
        
        if (request.unitPrice <= 0) {
            console.error("Valor não pode ser menor ou igual a zero");
            return;
        }
        
        if (request.quantity <= 0) {
            console.error("Quantidade não pode ser menor ou igual a zero");
            return;
        }

        try {
            const response = await api.post(
                `/table/${tableId}/orders`,
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

    static async getOrdersByTableId(tableId: string): Promise<Order[]> {
        try {

            if (!tableId) {
                throw new Error(`Identificador de mesa nulo`);
            }
            const response = await api.get(`/table/${tableId}/orders`)

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
