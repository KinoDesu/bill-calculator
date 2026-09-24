import { QrCode } from "@/models/QrCode";
import { Table } from "@/models/Table";
import { TableRegisterRequest } from "@/models/TableRegisterRequest";
import { api } from "./api";

export class TableService {
    static async updateTable(request: TableRegisterRequest) {
        const response = await api.post<Table>(
            `/table`,
            request
        );

        return response.data;
    }

    static async getQrCode(tableId: string): Promise<QrCode> {
        const response = await api.get<QrCode>(
            `/table/${tableId}/qrCode`,
            {
                timeout: 3000,
            }
        );

        return response.data;

    }

    static async registerTable(request: TableRegisterRequest): Promise<Table> {
        const response = await api.post<Table>(
            `/table`,
            request
        );

        return response.data;
    }

    static async getTableDataByCode(tableCode: string): Promise<Table> {
        const response = await api.get<Table>(
            `/table/code/${tableCode}`,
            {
                timeout: 3000,
            }
        );

        return response.data;
    }
}
