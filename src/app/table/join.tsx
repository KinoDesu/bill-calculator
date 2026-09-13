import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { useTable } from "@/contexts/TableContext";
import { useTheme } from "@/hooks/use-theme";
import { Table } from "@/models/Table";
import { api } from "@/services/api";
import { BaseStyle } from "@/styles/baseStyle";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";


export default function joinTable() {
    const theme = useTheme();
    const baseStyle = BaseStyle(theme);
    const [tableCode, setTableCode] = useState("");
    const [loading, setLoading] = useState(false);
    const { setTable } = useTable();

    function goToTable(tableCode: string) {
        if (!tableCode) {
            console.error("Código da mesa não encontrado");
            return;
        }

        setLoading(true);

        getTableData(tableCode)
            .then((table) => {
                console.log(table);
                
                setTable(table);
                router.replace({
                    pathname: "/table/[tableCode]",
                    params: {
                        tableCode
                    },
                });
            })
            .catch((error) => {
                console.error("Erro ao buscar mesa:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <View style={baseStyle.app}>
            <Background type="joinTable" />
            <View style={baseStyle.container}>
                <View style={baseStyle.inputContainer}>
                    <QRCodeScanner
                        onRead={(data) => {
                            try {
                                const url = new URL(data);
                                const code = url.pathname.split("/").pop();

                                if (code) {
                                    setTableCode(code);
                                    goToTable(code);
                                }
                            } catch (error) {
                                console.error("Erro ao buscar mesa:", error);
                            }
                        }}
                    />
                    <TextInput style={baseStyle.inputStyle} placeholder="Código da sala" placeholderTextColor={theme.inputPlaceHolder} onChangeText={(newValue) => setTableCode(newValue)} />
                    {
                        loading ? (
                            <View>
                                <ActivityIndicator
                                    size="large"
                                    color={theme.primary}
                                />

                                <Text
                                    style={[
                                        baseStyle.textStyle,
                                        {
                                            marginTop: 16,
                                        },
                                    ]}
                                >
                                    Buscando mesa...
                                </Text>
                            </View>
                        ) : null
                    }
                </View>
                <ThemedButton
                    title="Continuar"
                    onPress={() => goToTable(tableCode)}
                />
            </View>
        </View >
    );
};

async function getTableData(tableCode: string): Promise<Table> {
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