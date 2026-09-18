import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { useSession } from "@/contexts/SessionContext";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { Client } from "@/models/Client";
import { ClientService } from "@/services/clientService";
import { TableService } from "@/services/tableService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, View } from "react-native";

export default function joinClient() {

    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();

    const baseStyle = useBaseStyle();
    const { table, setTable } = useTable();

    const [clientList, setClientList] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState("");

    const [loading, setLoading] = useState({
        status: false,
        message: "",
    });

    const { saveSession } = useSession();

    useEffect(() => {
        loadTable();
    }, [tableCode]);

    async function loadTable() {
        try {
            setLoading({
                status: true,
                message: "Carregando mesa",
            });

            const table = await TableService.getTableDataByCode(tableCode)
            setTable(table);

            const clientList = await ClientService.getTableClients(table.tableId!);
            setClientList(clientList);

        } catch (error) {
            console.error(
                "Falha ao recuperar dados da mesa:",
                error
            );

            router.replace("/table/join");
        } finally {
            setLoading({
                status: false,
                message: "",
            });
        }
    }


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
                ) : !table ? null : (
                    <View style={baseStyle.style.app}>
                        <Background type="home" />
                        <View style={baseStyle.style.container}>
                            <ScrollView style={{
                                width: "100%",
                                paddingHorizontal: 15,
                                flex: 1,
                                ...(Platform.OS === "web" && {
                                    scrollbarWidth: "thin",
                                    scrollbarColor: `${baseStyle.theme.primary} transparent`,
                                })
                            }} contentContainerStyle={{
                                alignItems: "center",
                                flexGrow: 1,
                                gap: 15,
                            }}>

                                {clientList ? (
                                    clientList.map((client) => (
                                        <ThemedButton
                                            key={client.clientId}
                                            title={client.name}
                                            onPress={() => {
                                                goToTable(client.clientId);
                                            }}
                                        />

                                    ))
                                ) :
                                    (
                                        <Text>no clis</Text>
                                    )}

                            </ScrollView>
                        </View>
                    </View>
                )
            }
        </>
    );

    async function goToTable(clientId: string) {

        if (!table) {
            throw new Error("Valor da mesa inválido");
        }

        await saveSession({
            tableId: table.tableId!,
            tableCode: tableCode,
            clientId: clientId
        });

        router.replace({
            pathname: "/table/[tableCode]",
            params: {
                tableCode,
            },
        });
    }
}