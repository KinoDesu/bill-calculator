import { QrCode } from "@/models/QrCode";
import { Table } from "@/models/Table";
import { TableRegisterRequest } from "@/models/TableRegisterRequest";
import { api, getApiError } from "./api";

export class TableService {

    static async getQrCode(tableId: string): Promise<QrCode> {

        try {

            const response = await api.get<QrCode>(
                `/table/${tableId}/qrCode`,
                {
                    timeout: 3000,
                }
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

    static async registerTable(request: TableRegisterRequest): Promise<Table> {

        try {
            const response = await api.post<Table>(
                `/table`,
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

    static async getTableDataByCode(tableCode: string): Promise<Table> {

        try {
            const response = await api.get<Table>(
                `/table/code/${tableCode}`,
                {
                    timeout: 3000,
                }
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
}
