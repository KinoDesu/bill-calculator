import { Background } from "@/components/background";
import ClientSelect from "@/components/ClientSelect";
import { CustomNumberInput } from "@/components/customNumberInput";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { Client } from "@/models/Client";
import { Order } from "@/models/Order";
import { ClientService } from "@/services/clientService";
import { OrderService } from "@/services/orderService";
import { TableService } from "@/services/tableService";
import { TableSessionService } from "@/services/tableSessionService";
import { MaterialIcons } from "@expo/vector-icons";
import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

export default function Billing() {
    const { tableCode } = useLocalSearchParams<{ tableCode: string }>();
    const scrollViewRef = useRef<ScrollView>(null);

    const baseStyle = useBaseStyle();
    const { table, setTable } = useTable();

    const [orderList, setOrderList] = useState<Order[]>([]);
    const [sessionClientId, setSessionClientId] = useState("");
    const [tableClients, setTableClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedClientIdList, setSelectedClientIdList] = useState<
        string[]
    >([]);

    const [billingService, setBillingService] = useState(0);
    const [personalTotal, setPersonalTotal] = useState(0);
    const [combinedTotal, setCombinedTotal] = useState(0);

    const [loading, setLoading] = useState({
        status: false,
        message: "",
    });

    const loadTable = useCallback(async () => {
        if (!tableCode) {
            return;
        }

        try {
            setLoading({
                status: true,
                message: "Carregando mesa...",
            });

            let currentTable = table;

            if (!currentTable || currentTable.code !== tableCode) {
                currentTable = await TableService.getTableDataByCode(tableCode);

                if (!currentTable) {
                    router.replace("/");
                    return;
                }

                setTable(currentTable);
            }

            if (!currentTable?.tableId) {
                router.replace("/");
                return;
            }

            const session = await TableSessionService.get();

            if (!session?.clientId) {
                router.replace(`/table/join?tableCode=${tableCode}`);
                return;
            }

            setSessionClientId(session.clientId);

            const [clients, orders] = await Promise.all([
                ClientService.getTableClients(currentTable.tableId),
                OrderService.getOrdersByTableId(currentTable.tableId),
            ]);

            setTableClients(clients);
            setOrderList(orders);
        } catch (error) {
            console.error("Erro ao carregar mesa:", error);
            router.replace("/");
        } finally {
            setLoading({
                status: false,
                message: "",
            });
        }
    }, [tableCode, table, setTable]);

    useFocusEffect(
        useCallback(() => {
            loadTable();
        }, [loadTable])
    );

    useFocusEffect(
        useCallback(() => {
            handlePersonalTotal(sessionClientId, orderList);
        }, [sessionClientId, orderList, billingService])
    );

    useFocusEffect(
        useCallback(() => {
            handleCombinedBilling(selectedClientIdList);
        }, [billingService, selectedClientIdList, orderList])
    );

    const handleSubtotal = () => {
        return orderList.reduce((total, order) => {
            return total + Number(order.quantity * order.unitPrice || 0);
        }, 0);
    };

    const handleTotal = () => {
        const subtotal = handleSubtotal();

        return subtotal + subtotal * (billingService / 100);
    };


    function handlePersonalTotal(
        clientId: string,
        orders: Order[]
    ) {
        if (!clientId) {
            setPersonalTotal(0);
            return;
        }

        const total = orders.reduce(
            (total, order) => {
                order.clients.forEach((client) => {

                    if (client.clientId === clientId) {

                        total +=
                            client.amount;
                    }
                });

                return total;
            },
            0
        );

        setPersonalTotal(
            total * (1 + billingService / 100)
        );
    }

    function handleCombinedBilling(selectedClientIdList: string[]) {
        const total = orderList.reduce((total, order) => {
            order.clients.forEach((client) => {
                if (selectedClientIdList.includes(client.clientId)) {
                    total += client.amount
                }
            })
            return total;
        }, 0);
        setCombinedTotal(total * (1 + (billingService / 100)));
    }

    const handleSelectClient = (clientId: string) => {
        if (!clientId) {
            return;
        }

        setSelectedClientIdList((currentList) => {
            if (currentList.includes(clientId)) {
                return currentList;
            }

            return [...currentList, clientId];
        });

        setSelectedClientId("");
    };

    const handleRemoveClient = (clientId: string) => {
        setSelectedClientIdList((currentList) =>
            currentList.filter((id) => id !== clientId)
        );
    };

    function handleClientAmount(clientId: string) {
        if (!clientId) {
            return 0;
        }

        const total = orderList.reduce(
            (total, order) => {
                order.clients.forEach((client) => {

                    if (client.clientId === clientId) {

                        total +=
                            client.amount;
                    }
                });

                return total;
            },
            0
        );

        return total * (1 + billingService / 100);
    }

    const subtotal = handleSubtotal();
    const total = handleTotal();

    if (loading.status) {
        return (
            <View style={baseStyle.style.app}>
                <Background type="home" />

                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                    }}
                >
                    <ActivityIndicator size="large" />

                    <Text
                        style={[
                            baseStyle.style.headerTitleStyle,
                            {
                                marginTop: 15,
                                textAlign: "center",
                            },
                        ]}
                    >
                        {loading.message}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={baseStyle.style.app}>
            <Background type="home" />
            <KeyboardAwareScrollView bottomOffset={150} extraKeyboardSpace={200} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
                <View style={baseStyle.style.container}>
                    <View style={baseStyle.style.inputContainer}>
                        <View
                            style={{
                                width: "100%",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={baseStyle.style.headerTitleStyle}>
                                Subtotal
                            </Text>

                            <Text style={baseStyle.style.billPriceText}>
                                {subtotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Text>
                        </View>

                        <View
                            style={{
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CustomNumberInput
                                label="Serviço (%)"
                                value={billingService}
                                onChange={setBillingService}
                                min={0}
                                max={100}
                            />
                        </View>

                        <View
                            style={{
                                width: "100%",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={[
                                    baseStyle.style.headerTitleStyle,
                                    { fontWeight: "bold" },
                                ]}
                            >
                                Total
                            </Text>

                            <Text
                                style={[
                                    baseStyle.style.billPriceText,
                                    { fontWeight: "bold" },
                                ]}
                            >
                                {total.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Text>
                        </View>

                        <View
                            style={{
                                width: "100%",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 5,
                            }}
                        >
                            <Text style={baseStyle.style.headerTitleStyle}>
                                Minha conta
                            </Text>

                            <Text
                                style={[
                                    baseStyle.style.billPriceText,
                                    { fontWeight: "bold" },
                                ]}
                            >
                                {personalTotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Text>
                        </View>

                        <ClientSelect
                            clients={tableClients}
                            selectedClientIds={selectedClientIdList}
                            value={selectedClientId}
                            onChange={handleSelectClient}
                        />

                        {selectedClientIdList.length > 0 && (
                            <View
                                style={{
                                    width: "100%",
                                    alignItems: "center",
                                    gap: 15,
                                }}
                            >
                                <View
                                    style={
                                        baseStyle.style.selectedClientsContainer
                                    }
                                >
                                    {selectedClientIdList.map((clientId) => {
                                        const client = tableClients.find(
                                            (item) =>
                                                item.clientId === clientId
                                        );

                                        if (!client) {
                                            return null;
                                        }

                                        return (
                                            <View
                                                key={client.clientId}
                                                style={
                                                    baseStyle.style
                                                        .selectedClientContainer
                                                }
                                            >
                                                <View>
                                                    <Text
                                                        style={
                                                            baseStyle.style
                                                                .selectedClientName
                                                        }
                                                        numberOfLines={1}
                                                    >
                                                        {client.name}
                                                    </Text>

                                                    <Text
                                                        style={
                                                            baseStyle.style
                                                                .selectedClientName
                                                        }
                                                        numberOfLines={1}
                                                    >
                                                        {handleClientAmount(clientId).toLocaleString("pt-BR", {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        })}
                                                    </Text>
                                                </View>

                                                <Pressable
                                                    style={
                                                        baseStyle.style
                                                            .removeClientButton
                                                    }
                                                    onPress={() =>
                                                        handleRemoveClient(
                                                            client.clientId
                                                        )
                                                    }
                                                >
                                                    <MaterialIcons name={"close"} size={24} color={baseStyle.theme.primary} />
                                                </Pressable>
                                            </View>
                                        );
                                    })}
                                </View>

                                <View
                                    style={{
                                        width: "100%",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={[
                                            baseStyle.style.headerTitleStyle,
                                            { fontWeight: "bold" },
                                        ]}
                                    >
                                        Total
                                    </Text>

                                    <Text
                                        style={[
                                            baseStyle.style.billPriceText,
                                            { fontWeight: "bold" },
                                        ]}
                                    >
                                        {combinedTotal.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: "100%",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={[
                                            baseStyle.style.headerTitleStyle,
                                            { fontWeight: "bold" },
                                        ]}
                                    >
                                        Por Pessoa
                                    </Text>

                                    <Text
                                        style={[
                                            baseStyle.style.billPriceText,
                                            { fontWeight: "bold" },
                                        ]}
                                    >
                                        {(combinedTotal / (selectedClientIdList.length)).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

            </KeyboardAwareScrollView>
            <KeyboardToolbar opacity="00" />
        </View>
    );
}