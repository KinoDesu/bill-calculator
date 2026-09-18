import { TableSession } from "@/models/TableSession";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@calculaconta/table-session";

export const TableSessionService = {
    async save(session: TableSession): Promise<void> {
        await AsyncStorage.setItem(KEY, JSON.stringify(session));
    },

    async get(): Promise<TableSession | null> {
        const value = await AsyncStorage.getItem(KEY);

        return value ? JSON.parse(value) : null;
    },

    async clear(): Promise<void> {
        await AsyncStorage.removeItem(KEY);
    },
};