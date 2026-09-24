import { showError } from "@/components/CustomToast";
import ErrorEnum from "@/constants/errorEnum";
import { Order } from "@/models/Order";
import { OrderRegisterRequest } from "@/models/OrderRegisterRequest";
import { api } from "./api";

export class OrderService {
    static async getById(orderId: string): Promise<Order> {
        if (!orderId) {
            throw new Error(`Identificador de pedido nulo`);
        }
        const response = await api.get(`/order/${orderId}`)

        return response.data;
    }

    static async deleteById(orderId: string) {
        await api.delete(
            `/order/${orderId}`
        );
    }

    static async deleteAllByTableId(tableId: string) {
        await api.delete(
            `/table/${tableId}/orders`
        );
    }
    static async registerOrder(request: OrderRegisterRequest, tableId: string) {
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

        if (request.unitPrice <= 0) {
            showError(
                ErrorEnum.WARNING.description,
                "Valor não pode ser menor ou igual a zero"
            );
            return;
        }

        if (request.quantity <= 0) {
            showError(
                ErrorEnum.WARNING.description,
                "Quantidade não pode ser menor ou igual a zero"
            );
            return;
        }
        const response = await api.post(
            `/table/${tableId}/orders`,
            request
        );

        return response.data;
    }

    static async getOrdersByTableId(tableId: string): Promise<Order[]> {
        if (!tableId) {
            throw new Error(`Identificador de mesa nulo`);
        }
        const response = await api.get(`/table/${tableId}/orders`)

        return response.data;
    }
}
