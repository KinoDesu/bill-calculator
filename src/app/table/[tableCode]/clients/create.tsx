import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { useTable } from "@/contexts/TableContext";
import { useTheme } from "@/hooks/use-theme";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { Table } from "@/models/Table";
import { api } from "@/services/api";
import { BaseStyle } from "@/styles/baseStyle";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, View } from "react-native";

export default function registerClients() {
    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();
    
    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    const { table, setTable } = useTable();

    const [loading, setLoading] = useState(false);

    const [clientNames, setClientNames] = useState<string[]>([]);

    useEffect(() => {
        if (table || !tableCode) {
            return;
        }

        setLoading(true);

        getTableData(tableCode)
            .then((table) => {
                setTable(table);
            })
            .catch(() => {
                console.error("Falha ao recuperar dados da mesa");
                router.replace("/table/join");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [table, tableCode]);

    const clientQuantity = useTable().table?.clientQuantity;

    return (
        <View style={baseStyle.app}>
            <Background type="home" />
            <View style={baseStyle.container}>
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

                <ScrollView style={{
                    padding: 15, flex: 1, ...(Platform.OS === "web" && {
                        scrollbarWidth: "thin",
                        scrollbarColor: `${theme.primary} transparent`,
                    })
                }} contentContainerStyle={{
                    alignItems: "center",
                    flexGrow: 1
                }}>
                    <View style={baseStyle.inputContainer}>

                        {
                            Array.from({ length: Math.max((clientQuantity ?? 0) - 1, 0) }, (_, index) => (
                                <TextInput
                                    style={baseStyle.inputStyle}
                                    key={index}
                                    placeholder={`Nome do cliente ${index + 2}`}
                                    placeholderTextColor={theme.inputPlaceHolder}
                                    value={clientNames[index] ?? ""}
                                    onChangeText={(value) => {
                                        setClientNames((current) => {
                                            const names = [...current];
                                            names[index] = value;
                                            return names;
                                        });
                                    }}
                                />

                            ))}

                    </View>
                </ScrollView>
                <ThemedButton
                    title="Criar mesa"
                    onPress={() => registerClients()}
                />
            </View>
        </View>
    );

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

    async function registerClients() {
        if (!table) {
            return;
        }

        const hasEmptyName = clientNames.some(
            (name) => !name || name.trim() === ""
        );

        if (hasEmptyName) {
            console.error("Todos os clientes precisam ter um nome");
            return;
        }

        try {
            for (const name of clientNames) {
                const request: ClientRegisterRequest = {
                    name: name.trim(),
                    bot: true,
                    clientId: null,
                };

                await api.post(`/table/${table.tableId}/clients`, request);
            }

            console.log("Clientes registrados com sucesso");
        } catch (error) {
            console.error("Erro ao registrar cliente:", error);
        }
    }
};
