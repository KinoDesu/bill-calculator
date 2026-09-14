import { Order } from "@/models/Order";
import { api } from "./api";

export class OrderService {
    static async getOrdersByTableId(tableId: string): Promise<Order[]> {
        if (!tableId) {
            throw new Error(`Identificador de mesa nulo`);
        }
        const response = await api.get(`/table/${tableId}/orders`)

        if (response.status !== 200) {
            throw new Error(`Falha ao buscar pedidos: code: ${response.status}, data: ${response.data}`);
        }

        return response.data;
    }
}
