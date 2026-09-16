import { useTheme } from "@/hooks/use-theme";
import { Client } from "@/models/Client";
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
    clients: Client[];
    selectedClientIds: string[];
    value: string | null;
    onChange: (clientId: string) => void;
}

export default function ClientSelect({
    clients,
    selectedClientIds,
    value,
    onChange,
}: ClientSelectProps) {
    const [open, setOpen] = useState(false);
    const [clientName, setClientName] = useState("");

    const theme = useTheme();

    if (!theme.isReady) {
        return null; // não renderiza nada até saber o tema de verdade
    }

    const baseStyle = BaseStyle(theme);

    useEffect(() => {
        const selectedClient = clients.find(
            (client) => client.clientId === value
        );

        if (selectedClient) {
            setClientName(selectedClient.name);
        }

        if (!value) {
            setClientName("");
        }
    }, [value, clients]);

    function handleChangeName(text: string) {
        setClientName(text);
        setOpen(true);

        if (value) {
            onChange("");
        }
    }

    function handleSelectClient(client: Client) {
        onChange(client.clientId);
        setOpen(false);
        setClientName("");
    }

    const filteredClients = clients.filter((client) => {
        const matchesName = client.name
            .toLowerCase()
            .includes(clientName.toLowerCase());

        const isAlreadySelected = selectedClientIds.includes(
            client.clientId
        );

        return matchesName && !isAlreadySelected;
    });

    return (
        <View style={baseStyle.clientSelectContainer}>
            {/* Campo de seleção */}
            <View style={baseStyle.clientInputContainer}>
                <TextInput
                    style={baseStyle.clientInput}
                    placeholder="Nome do cliente"
                    placeholderTextColor={theme.inputPlaceHolder}
                    value={clientName}
                    onChangeText={handleChangeName}
                    editable={clients.length > 0}
                    onFocus={() => {
                        setOpen(true);
                    }}
                />

                <Pressable
                    onPress={() => setOpen((current) => !current)}
                    disabled={clients.length === 0}
                    style={({ hovered, pressed }) => [
                        baseStyle.clientInputButtonStyle,
                        {
                            opacity: clients.length === 0 ? 0.5 : 1,
                            transform: [
                                {
                                    scale: pressed ? 0.95 : 1,
                                },
                            ],
                        },
                        hovered &&
                        clients.length > 0 && {
                            opacity: 0.85,
                        },
                    ]}
                >
                    <Text style={baseStyle.clientInputButtonTextStyle}>
                        {open ? "▴" : "▾"}
                    </Text>
                </Pressable>
            </View>

            {/* Dropdown */}
            {open && (
                <View style={baseStyle.clientInputListContainer}>
                    {filteredClients.length === 0 ? (
                        <View style={{ padding: 16 }}>
                            <Text style={baseStyle.textStyle}>
                                Nenhum cliente encontrado
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredClients}
                            keyExtractor={(client) => client.clientId}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => handleSelectClient(item)}
                                    style={({ hovered, pressed }) => [
                                        {
                                            paddingVertical: 14,
                                            paddingHorizontal: 16,
                                        },
                                        hovered && {
                                            backgroundColor: theme.primary + "20",
                                        },
                                        pressed && {
                                            backgroundColor: theme.primary + "40",
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