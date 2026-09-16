import { OrderClient } from "./OrderClient";

export type Order = {
    orderId: string,
    name: string,
    unitPrice: number,
    quantity: number,
    clients: OrderClient[],
}