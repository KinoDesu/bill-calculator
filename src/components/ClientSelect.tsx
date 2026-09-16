import { useTheme } from "@/hooks/use-theme";
import { Client } from "@/models/Client";
import { ClientService } from "@/services/clientService";
import { BaseStyle } from "@/styles/baseStyle";
import { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

interface ClientSelectProps {
    tableId: string | null;
    value: string | null;
    onChange: (clientId: string) => void;
}

export default function ClientSelect({
    tableId,
    value,
    onChange,
}: ClientSelectProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState("");

    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    useEffect(() => {
        if (!tableId) {
            return;
        }

        loadClients(tableId);
    }, [tableId]);

    useEffect(() => {
        const selectedClient = clients.find(
            (client) => client.clientId === value
        );

        if (selectedClient) {
            setClientName(selectedClient.name);
        }
    }, [value, clients]);

    async function loadClients(currentTableId: string) {
        try {
            setLoading(true);

            const clients =
                await ClientService.getTableClients(currentTableId);

                setClients(clients);
        } catch (error) {
            console.error(
                "Erro ao buscar clientes:",
                error
            );

            setClients([]);
        } finally {
            setLoading(false);
        }
    }

    function handleChangeName(text: string) {
        setClientName(text);
        setOpen(true);

        if (value) {
            onChange("");
        }
    }

    function handleSelectClient(client: Client) {
        setClientName(client.name);
        onChange(client.clientId);
        setOpen(false);
    }

    const filteredClients = clients.filter((client) =>
        client.name
            .toLowerCase()
            .includes(clientName.toLowerCase())
    );

    return (
        <View>
            {/* Input */}
            <View style={baseStyle.clientInputContainer}>
                <TextInput
                    style={[baseStyle.clientInput]}
                    placeholder="Nome do cliente"
                    placeholderTextColor={
                        theme.inputPlaceHolder
                    }
                    value={clientName}
                    onChangeText={handleChangeName}
                    editable={!loading}
                    onFocus={() => {
                        setOpen(true);
                    }}
                />

                <Pressable
                    onPress={() =>
                        setOpen((current) => !current)
                    }
                    disabled={loading || clients.length === 0}
                    style={({ hovered, pressed }) => [
                        baseStyle.clientInputButtonStyle,
                        {
                            opacity:
                                loading || clients.length === 0
                                    ? 0.5
                                    : 1,

                            transform: [
                                {
                                    scale: pressed ? 0.95 : 1,
                                },
                            ],
                        },
                        hovered &&
                        !loading &&
                        clients.length > 0 && {
                            opacity: 0.85,
                        },
                    ]}
                >
                    <Text
                        style={
                            baseStyle.clientInputButtonTextStyle
                        }
                    >
                        {open ? "▴" : "▾"}
                    </Text>
                </Pressable>
            </View>

            {/* Lista */}
            {open && (
                <View
                    style={[baseStyle.clientInputListContainer]}
                >
                    {filteredClients.length === 0 ? (
                        <View
                            style={{
                                padding: 16,
                            }}
                        >
                            <Text
                                style={baseStyle.textStyle}
                            >
                                Nenhum cliente encontrado
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredClients}
                            keyExtractor={(client) =>
                                client.clientId
                            }
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() =>
                                        handleSelectClient(item)
                                    }
                                    style={({ hovered, pressed }) => [
                                        {
                                            paddingVertical: 14,
                                            paddingHorizontal: 16,
                                        },
                                        hovered && {
                                            backgroundColor:
                                                theme.primary + "20",
                                        },
                                        pressed && {
                                            backgroundColor:
                                                theme.primary + "40",
                                        },
                                    ]}
                                >
                                    <Text style={baseStyle.textStyle}>
                                        {item.name}
                                    </Text>
                                </Pressable>
                            )}
                        />
                    )}
                </View>
            )}
        </View>
    );
}