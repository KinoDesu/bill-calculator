export type OrderRegisterRequest = {
    orderId: string | null,
    name: string,
    unitPrice: number,
    quantity: number,
    clientList: string[]
}