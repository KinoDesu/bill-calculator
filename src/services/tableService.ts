import { Table } from "@/models/Table";
import { TableRegisterRequest } from "@/models/TableRegisterRequest";
import { api } from "./api";

export class TableService {
    static async registerTable(request: TableRegisterRequest): Promise<Table> {

        const response = await api.post<Table>(
            `/table`,
            request
        );

        if (response.status !== 201) {
            throw new Error(`Falha ao criar mesa: code: ${response.status}, data: ${response.data}`);
        }

        return response.data;
    }

    static async getTableDataByCode(tableCode: string): Promise<Table> {
        const response = await api.get<Table>(
            `/table/code/${tableCode}`,
            {
                timeout: 3000,
            }
        );

        if (!response.data) {
            throw new Error("Mesa não encontrada");
        }

        return response.data;
    }
}
