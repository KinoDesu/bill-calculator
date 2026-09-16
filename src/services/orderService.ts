import { Order } from "@/models/Order";
import { api, getApiError } from "./api";

export class OrderService {
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
