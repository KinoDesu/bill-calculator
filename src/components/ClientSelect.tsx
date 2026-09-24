import { useBaseStyle } from "@/contexts/StyleContext";
import { Client } from "@/models/Client";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
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
    const baseStyle = useBaseStyle();

    const [open, setOpen] = useState(false);
    const [clientName, setClientName] = useState("");

    useEffect(() => {
        if (!value) {
            setClientName("");
            return;
        }

        const selectedClient = clients.find(
            (client) => client.clientId === value
        );

        setClientName(selectedClient?.name ?? "");
    }, [value, clients]);

    const filteredClients = clients.filter((client) => {
        const alreadySelected = selectedClientIds.includes(client.clientId);

        if (alreadySelected) {
            return false;
        }

        if (!clientName.trim()) {
            return true;
        }

        return client.name
            .toLowerCase()
            .includes(clientName.toLowerCase());
    });

    const handleChangeName = (text: string) => {
        setClientName(text);
        setOpen(true);

        if (!text.trim()) {
            onChange("");
        }
    };

    const handleSelectClient = (client: Client) => {
        setClientName("");
        setOpen(false);
        onChange(client.clientId);
    };

    return (
        <View style={baseStyle.style.clientSelectContainer}>
            <TextInput
                value={clientName}
                onChangeText={handleChangeName}
                onFocus={() => setOpen(true)}
                placeholder="Adicionar cliente"
                placeholderTextColor={baseStyle.theme?.inputPlaceHolder}
                style={baseStyle.style.inputStyle}
                autoCapitalize="words"
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

            {open && (
                <View style={baseStyle.style.clientInputListContainer}>
                    {filteredClients.length === 0 ? (
                        <View
                            style={{
                                padding: 16,
                            }}
                        >
                            <Text style={baseStyle.style.textStyle}>
                                Nenhum cliente encontrado
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            nestedScrollEnabled
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {filteredClients.map((client) => (
                                <Pressable
                                    key={client.clientId}
                                    onPress={() =>
                                        handleSelectClient(client)
                                    }
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                    }}
                                >
                                    <Text style={baseStyle.style.textStyle}>
                                        {client.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    )}
                </View>
            )}
        </View>
    );
}