import { Background } from "@/components/background";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { useTheme } from "@/hooks/use-theme";
import { Table } from "@/models/Table";
import { api } from "@/services/api";
import { BaseStyle } from "@/styles/baseStyle";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function joinTable() {
    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    return (
        <View style={baseStyle.app}>
            <Background type="joinTable" />
            <View style={baseStyle.container}>
                <QRCodeScanner
                    onRead={async (data) => {
                        try {
                            const url = new URL(data);
                            const tableCode = url.pathname.split("/").pop();

                            if (!tableCode) {
                                return;
                            }

                            const response = await api.get<Table>(
                                `/table/code/${tableCode}`
                            );

                            const table = response.data;

                            router.push({
                                pathname: "/table/[tableCode]",
                                params: {
                                    tableCode: table.code,
                                    table: JSON.stringify(table),
                                },
                            });
                        } catch (error) {
                            console.error("Erro ao buscar mesa:", error);
                        }
                    }}
                />
                < Text style={baseStyle.textStyle} > join table screen.</Text>
            </View>
        </View >
    );
};