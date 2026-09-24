import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import ClientSelect from "@/components/ClientSelect";
import { CustomNumberInput } from "@/components/customNumberInput";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { Client } from "@/models/Client";
import { Order } from "@/models/Order";
import { OrderRegisterRequest } from "@/models/OrderRegisterRequest";
import { ClientService } from "@/services/clientService";
import { OrderService } from "@/services/orderService";
import { TableService } from "@/services/tableService";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    useWindowDimensions,
    View
} from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";

interface OrderFormProps {
    mode: "create" | "edit";
}

export default function OrderForm({ mode }: OrderFormProps) {

    const {
        tableCode,
        orderId,
    } = useLocalSearchParams<{
        tableCode: string;
        orderId?: string;
    }>();

    const { height: screenHeight } = useWindowDimensions();

    const baseStyle = useBaseStyle();

    const { table, setTable } = useTable();

    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const [itemPriceText, setItemPriceText] = useState("");
    const [itemQuantity, setItemQuantity] = useState(1);

    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedClientIdList, setSelectedClientIdList] = useState<string[]>([]);

    const [clients, setClients] = useState<Client[]>([]);

    const [loading, setLoading] = useState({
        status: false,
        message: "",
    });

    const [successOrder, setSuccessOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadData();
    }, [tableCode, orderId, mode]);

    async function loadData() {
        try {
            setLoading({
                status: true,
                message: "Carregando mesa",
            });

            let currentTable = table;

            if (!currentTable || currentTable.code !== tableCode) {
                currentTable = await TableService.getTableDataByCode(tableCode);
                setTable(currentTable);
            }

            if (!currentTable?.tableId) {
                return;
            }

            await loadClients(currentTable.tableId);

            if (mode === "edit") {
                if (!orderId) {
                    router.back();
                    return;
                }

                await loadOrder(orderId);
            }

        } catch (error) {
            console.error("Falha ao carregar dados:", error);
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
            setLoading({
                status: true,
                message: "Carregando clientes",
            });

            const clients = await ClientService.getTableClients(tableId);

            setClients(clients);

        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            router.back();
        }
    }

    async function loadOrder(id: string) {
        try {
            setLoading({
                status: true,
                message: "Carregando pedido",
            });

            const order = await OrderService.getById(id);

            setItemName(order.name);
            setItemPrice(order.unitPrice);
            setItemPriceText(
                order.unitPrice.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
            setItemQuantity(order.quantity);

            setSelectedClientIdList(
                order.clients.map((client) => client.clientId)
            );

        } catch (error) {
            console.error("Erro ao buscar pedido:", error);
            router.back();
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
                message: mode === "create"
                    ? "Gravando pedido"
                    : "Atualizando pedido",
            });

            const request: OrderRegisterRequest = {
                orderId: mode === "edit"
                    ? orderId ?? null
                    : null,

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
            console.error(
                mode === "create"
                    ? "Erro ao gravar pedido:"
                    : "Erro ao atualizar pedido:",
                error
            );

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
        <>
            {loading.status ? (
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
                    <KeyboardAwareScrollView bottomOffset={150} extraKeyboardSpace={200} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>

                        <View style={baseStyle.style.container}>

                            <View style={baseStyle.style.inputContainer}>

                                <TextInput
                                    style={baseStyle.style.inputStyle}
                                    placeholder="Item"
                                    placeholderTextColor={
                                        baseStyle.theme.inputPlaceHolder
                                    }
                                    value={itemName}
                                    onChangeText={setItemName}
                                />

                                <View
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        maxWidth: 350,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 5,
                                    }}
                                >
                                    <Text style={baseStyle.style.buttonText}>
                                        R$
                                    </Text>

                                    <TextInput
                                        style={[
                                            baseStyle.style.inputStyle,
                                            { maxWidth: 200 },
                                        ]}
                                        placeholder="Valor"
                                        placeholderTextColor={
                                            baseStyle.theme.inputPlaceHolder
                                        }
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

                                {selectedClientIdList.length > 0 && (

                                    <View
                                        style={[
                                            baseStyle.style.selectedClientsContainer,
                                            {
                                                alignItems: "center",
                                                justifyContent: "center",
                                            },
                                        ]}
                                    >
                                        {selectedClientIdList.map((clientId) => {

                                            const client = clients.find(
                                                (client) =>
                                                    client.clientId === clientId
                                            );

                                            if (!client) {
                                                return null;
                                            }

                                            return (
                                                <View
                                                    key={clientId}
                                                    style={
                                                        baseStyle.style.selectedClientContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            baseStyle.style.selectedClientName
                                                        }
                                                    >
                                                        {client.name}
                                                    </Text>

                                                    <Pressable
                                                        onPress={() => {
                                                            setSelectedClientIdList(
                                                                (current) =>
                                                                    current.filter(
                                                                        (id) => id !== clientId
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
                                                        <MaterialIcons name={"close"} size={24} color={baseStyle.theme.primary} />
                                                    </Pressable>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>


                            <ThemedButton
                                title={
                                    mode === "create"
                                        ? "Fazer pedido"
                                        : "Salvar alterações"
                                }
                                onPress={handleRegisterOrder}
                            />

                        </View>
                    </KeyboardAwareScrollView>
                    <KeyboardToolbar opacity="00" />

                    {successOrder && (
                        <View style={baseStyle.style.modalOverlay}>
                            <View style={baseStyle.style.modalContainer}>

                                <Text style={baseStyle.style.modalTitle}>
                                    {mode === "create"
                                        ? "Pedido feito!"
                                        : "Pedido atualizado!"}
                                </Text>

                                <View style={baseStyle.style.modalContent}>

                                    <Text
                                        style={baseStyle.style.modalItemName}
                                    >
                                        {successOrder.name}
                                    </Text>

                                    <Text style={baseStyle.style.modalInfo}>
                                        Valor unitário:{" "}
                                        {formatCurrency(
                                            successOrder.unitPrice
                                        )}
                                    </Text>

                                    <Text style={baseStyle.style.modalInfo}>
                                        Quantidade:{" "}
                                        {successOrder.quantity}
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
                                        router.back();
                                    }}
                                />

                            </View>
                        </View>
                    )}

                </View>
            )}
        </>
    );
}