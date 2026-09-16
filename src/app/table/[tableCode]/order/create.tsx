import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import ClientSelect from "@/components/ClientSelect";
import { CustomNumberInput } from "@/components/customNumberInput";
import { useBaseStyle } from "@/contexts/StyleContext";
import { Client } from "@/models/Client";
import { Order } from "@/models/Order";
import { OrderRegisterRequest } from "@/models/OrderRegisterRequest";
import { Table } from "@/models/Table";
import { ClientService } from "@/services/clientService";
import { OrderService } from "@/services/orderService";
import { TableService } from "@/services/tableService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

export default function CreateOrder() {
    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();

    const { height: screenHeight } = useWindowDimensions();

    const baseStyle = useBaseStyle();

    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const [itemPriceText, setItemPriceText] = useState("");
    const [itemQuantity, setItemQuantity] = useState(1);

    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedClientIdList, setSelectedClientIdList] = useState<string[]>([]);

    const [clients, setClients] = useState<Client[]>([]);
    const [table, setTable] = useState<Table | null>(null);

    const [loading, setLoading] = useState({
        status: true,
        message: "",
    });

    const [successOrder, setSuccessOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (table || !tableCode) {
            return;
        }

        loadTable();
    }, [table, tableCode]);

    async function loadTable() {
        try {
            setLoading({
                status: true,
                message: "Entrando na mesa",
            });

            const table = await TableService.getTableDataByCode(tableCode);

            setTable(table);

            await loadClients(table.tableId ?? "");
        } catch (error) {
            console.error("Falha ao recuperar dados da mesa:", error);

            router.replace("/table/join");
        } finally {
            setLoading({
                status: false,
                message: "",
            });
        }
    }

    async function loadClients(tableId: string) {
        try {
            const clients = await ClientService.getTableClients(tableId);
            setClients(clients);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            setClients([]);
        }
    }

    function handleItemPriceChange(value: string) {
        const numericValue = value.replace(/\D/g, "");

        if (!numericValue) {
            setItemPrice(0);
            setItemPriceText("");
            return;
        }

        const price = Number(numericValue) / 100;

        setItemPrice(price);

        setItemPriceText(
            price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    }

    async function handleRegisterOrder() {
        if (!table?.tableId) {
            return;
        }

        try {
            setLoading({
                status: true,
                message: "Gravando pedido",
            });

            const request: OrderRegisterRequest = {
                orderId: null,
                name: itemName,
                unitPrice: itemPrice,
                quantity: itemQuantity,
                clientList: selectedClientIdList,
            };

            const order = await OrderService.registerOrder(
                request,
                table.tableId
            );

            setSuccessOrder(order);
        } catch (error) {
            console.error("Erro ao gravar pedido:", error);
        } finally {
            setLoading({
                status: false,
                message: "",
            });
        }
    }

    function formatCurrency(value: number) {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <View style={baseStyle.style.app}>
            <Background type="home" />

            <View style={baseStyle.style.container}>
                <View style={baseStyle.style.inputContainer}>
                    <TextInput
                        style={baseStyle.style.inputStyle}
                        placeholder="Item"
                        placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                        onChangeText={setItemName}
                    />

                    <View style={[{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        maxWidth: 350,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 5,
                    }]}>
                        <Text style={[baseStyle.style.buttonText]}>
                            R$
                        </Text>
                        <TextInput
                            style={[baseStyle.style.inputStyle, { width: 200 }]}
                            placeholder="Valor"
                            placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                            keyboardType="numeric"
                            value={itemPriceText}
                            onChangeText={handleItemPriceChange}
                        />
                    </View>

                    <CustomNumberInput
                        label="Quantidade"
                        min={1}
                        max={100}
                        value={itemQuantity}
                        onChange={setItemQuantity}
                    />

                    <ClientSelect
                        clients={clients}
                        selectedClientIds={selectedClientIdList}
                        value={selectedClientId}
                        onChange={(clientId) => {
                            setSelectedClientIdList((current) => [
                                ...current,
                                clientId,
                            ]);

                            setSelectedClientId("");
                        }}
                    />
                </View>

                {selectedClientIdList.length > 0 && (
                    <ScrollView
                        style={[
                            baseStyle.style.selectedClientsScroll,
                            {
                                maxHeight: screenHeight * 0.30,
                                ...(Platform.OS === "web" && {
                                    scrollbarWidth: "thin",
                                    scrollbarColor: `${baseStyle.theme.primary} transparent`,
                                }),
                            },
                        ]}
                        contentContainerStyle={{
                            alignItems: "flex-start",
                            flexGrow: 1,
                        }}
                    >
                        <View
                            style={[
                                baseStyle.style.selectedClientsContainer,
                                {
                                    height: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                },
                            ]}
                        >
                            {selectedClientIdList.map((clientId) => {
                                const client = clients.find(
                                    (client) => client.clientId === clientId
                                );

                                if (!client) {
                                    return null;
                                }

                                return (
                                    <View
                                        key={clientId}
                                        style={baseStyle.style.selectedClientContainer}
                                    >
                                        <Text
                                            style={baseStyle.style.selectedClientName}
                                        >
                                            {client.name}
                                        </Text>

                                        <Pressable
                                            onPress={() => {
                                                setSelectedClientIdList(
                                                    (current) =>
                                                        current.filter(
                                                            (id) =>
                                                                id !== clientId
                                                        )
                                                );
                                            }}
                                            style={({ pressed }) => [
                                                baseStyle.style.removeClientButton,
                                                {
                                                    opacity: pressed ? 0.6 : 1,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={
                                                    baseStyle.style.removeClientButtonText
                                                }
                                            >
                                                ×
                                            </Text>
                                        </Pressable>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                )}

                <ThemedButton
                    title="Fazer pedido"
                    onPress={handleRegisterOrder}
                />
            </View>

            {/* Loading */}
            {loading.status && (
                <View style={baseStyle.style.loadingOverlay}>
                    <View style={baseStyle.style.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color={baseStyle.theme.primary}
                        />
                        {Boolean(loading.message) && (
                            <Text style={baseStyle.style.loadingText}>
                                {loading.message}
                            </Text>
                        )}
                    </View>
                </View>
            )}

            {/* Pedido gravado */}
            {successOrder && (
                <View style={baseStyle.style.modalOverlay}>
                    <View style={baseStyle.style.modalContainer}>
                        <Text style={baseStyle.style.modalTitle}>
                            Pedido gravado!
                        </Text>

                        <View style={baseStyle.style.modalContent}>
                            <Text style={baseStyle.style.modalItemName}>
                                {successOrder.name}
                            </Text>

                            <Text style={baseStyle.style.modalInfo}>
                                Valor unitário:{" "}
                                {formatCurrency(successOrder.unitPrice)}
                            </Text>

                            <Text style={baseStyle.style.modalInfo}>
                                Quantidade: {successOrder.quantity}
                            </Text>

                            <Text style={baseStyle.style.modalInfo}>
                                Total:{" "}
                                {formatCurrency(
                                    successOrder.unitPrice *
                                    successOrder.quantity
                                )}
                            </Text>
                        </View>

                        <ThemedButton
                            title="Confirmar"
                            onPress={() => {
                                setSuccessOrder(null);

                                router.replace(
                                    `/table/${tableCode}`
                                );
                            }}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}