import { useBaseStyle } from "@/contexts/StyleContext";
import { Client } from "@/models/Client";
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

    const baseStyle = useBaseStyle();

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
        <View style={baseStyle.style.clientSelectContainer}>
            {/* Campo de seleção */}
            <View style={baseStyle.style.clientInputContainer}>
                <TextInput
                    style={baseStyle.style.clientInput}
                    placeholder="Nome do cliente"
                    placeholderTextColor={baseStyle.theme.inputPlaceHolder}
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
                        baseStyle.style.clientInputButtonStyle,
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
                    <Text style={baseStyle.style.clientInputButtonTextStyle}>
                        {open ? "▴" : "▾"}
                    </Text>
                </Pressable>
            </View>

            {/* Dropdown */}
            {open && (
                <View style={baseStyle.style.clientInputListContainer}>
                    {filteredClients.length === 0 ? (
                        <View style={{ padding: 16 }}>
                            <Text style={baseStyle.style.textStyle}>
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
                                            backgroundColor: baseStyle.theme.primary + "20",
                                        },
                                        pressed && {
                                            backgroundColor: baseStyle.theme.primary + "40",
                                        },
                                    ]}
                                >
                                    <Text style={baseStyle.style.textStyle}>
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