import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { ClientService } from "@/services/clientService";
import { TableService } from "@/services/tableService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, View } from "react-native";

export default function registerClients() {
    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();

    const baseStyle = useBaseStyle();

    const { table, setTable } = useTable();

    const [loading, setLoading] = useState({ status: false, message: "" });

    const [clientNames, setClientNames] = useState<string[]>([]);

    useEffect(() => {
        setLoading({ status: true, message: "Recuperando mesa" });

        TableService.getTableDataByCode(tableCode)
            .then((table) => {
                setTable(table);
            })
            .catch(() => {
                console.error("Falha ao recuperar dados da mesa");
                router.replace("/table/join");
            })
            .finally(() => {
                setLoading({ status: false, message: "" });
            });
    }, [tableCode]);

    const clientQuantity = useTable().table?.clientQuantity;

    return (
        <>

            {
                loading.status ? (
                    <View
                        style={[
                            baseStyle.style.app,
                            baseStyle.style.loadingContainer,
                        ]}
                    >
                        <ActivityIndicator
                            size="large"
                            color={baseStyle.theme.primary}
                        />

                        <Text style={baseStyle.style.textStyle}>
                            {loading.message}
                        </Text>
                    </View>
                ) : (

                    <View style={baseStyle.style.app}>
                        <Background type="home" />
                        <View style={baseStyle.style.container}>
                            {
                                loading.status ? (
                                    <View>
                                        <ActivityIndicator
                                            size="large"
                                            color={baseStyle.theme.primary}
                                        />

                                        <Text
                                            style={[
                                                baseStyle.style.textStyle,
                                                {
                                                    marginTop: 16,
                                                },
                                            ]}
                                        >
                                            {loading.message}
                                        </Text>
                                    </View>
                                ) : null
                            }

                            <ScrollView style={{
                                width: "100%",
                                padding: 15, flex: 1, ...(Platform.OS === "web" && {
                                    scrollbarWidth: "thin",
                                    scrollbarColor: `${baseStyle.theme.primary} transparent`,
                                })
                            }} contentContainerStyle={{
                                alignItems: "center",
                                flexGrow: 1
                            }}>
                                <View style={baseStyle.style.inputContainer}>

                                    {
                                        Array.from({ length: Math.max((clientQuantity ?? 0) - 1, 0) }, (_, index) => (
                                            <TextInput
                                                style={baseStyle.style.inputStyle}
                                                key={index}
                                                placeholder={`Nome do cliente ${index + 2}`}
                                                placeholderTextColor={baseStyle.theme.inputPlaceHolder}
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
                                onPress={() => {
                                    const hasEmptyName = clientNames.some(
                                        (name) => !name || name.trim() === ""
                                    );

                                    if (hasEmptyName) {
                                        console.error("Todos os clientes precisam ter um nome");
                                        return;
                                    }

                                    setLoading({ status: true, message: "Cadastrando clientes" });

                                    try {
                                        for (const name of clientNames) {
                                            const request: ClientRegisterRequest = {
                                                name: name.trim(),
                                                clientId: null,
                                            };

                                            ClientService.registerClient(request, table?.tableId!);
                                        }

                                    } catch (error) {
                                        console.error("Erro ao registrar cliente:", error);
                                    } finally {
                                        setLoading({ status: false, message: "" });
                                    }

                                    router.replace({
                                        pathname: "/table/[tableCode]",
                                        params: {
                                            tableCode
                                        },
                                    });

                                }}
                            />
                        </View>
                    </View>
                )
            }

        </>
    );
};
