import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { useSession } from "@/contexts/SessionContext";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { Table } from "@/models/Table";
import { api } from "@/services/api";
import { TableSessionService } from "@/services/tableSessionService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Text,
    TextInput,
    View,
} from "react-native";

export default function JoinTable() {
    const baseStyle = useBaseStyle();

    const [tableCode, setTableCode] = useState("");
    const [loading, setLoading] = useState(false);

    const [savedTable, setSavedTable] = useState<Table | null>(null);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    const { setTable } = useTable();
    const { saveSession } = useSession();

    useEffect(() => {
        checkSavedSession();
    }, []);

    async function checkSavedSession() {
        try {
            const session = await TableSessionService.get();

            if (!session) {
                return;
            }

            const table = await getTableData(session.tableCode);

            setSavedTable(table);
            setShowResumeModal(true);
        } catch (error) {
            console.error("Erro ao recuperar sessão:", error);

            await TableSessionService.clear();
        } finally {
            setCheckingSession(false);
        }
    }

    async function goToTable(tableCode: string) {
        if (!tableCode) {
            console.error("Código da mesa não encontrado");
            return;
        }

        setLoading(true);

        getTableData(tableCode)
            .then(async (table) => {
                setTable(table);

                await saveSession({
                    tableId: table.tableId!,
                    tableCode: tableCode,
                });

                router.replace({
                    pathname: "/table/[tableCode]",
                    params: {
                        tableCode,
                    },
                });
            })
            .catch((error) => {
                console.error("Erro ao buscar mesa:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function resumeTable() {
        if (!savedTable) {
            return;
        }

        setShowResumeModal(false);

        setTable(savedTable);

        router.replace({
            pathname: "/table/[tableCode]",
            params: {
                tableCode: savedTable.code ?? "",
            },
        });
    }

    async function rejectSavedTable() {
        await TableSessionService.clear();

        setSavedTable(null);
        setShowResumeModal(false);
    }

    return (
        <View style={baseStyle.style.app}>
            <Background type="joinTable" />

            <View style={baseStyle.style.container}>
                <View style={baseStyle.style.inputContainer}>
                    <QRCodeScanner
                        onRead={(data) => {
                            try {
                                const url = new URL(data);
                                const code = url.pathname.split("/").pop();

                                if (code) {
                                    setTableCode(code);
                                    goToTable(code);
                                }
                            } catch (error) {
                                console.error(
                                    "Erro ao buscar mesa:",
                                    error
                                );
                            }
                        }}
                    />

                    <TextInput
                        style={baseStyle.style.inputStyle}
                        placeholder="Código da sala"
                        placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                        onChangeText={(newValue) =>
                            setTableCode(newValue)
                        }
                    />

                    {loading ? (
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
                                Buscando mesa...
                            </Text>
                        </View>
                    ) : null}
                </View>

                <ThemedButton
                    title="Continuar"
                    onPress={() => goToTable(tableCode)}
                />
            </View>

            <Modal
                visible={showResumeModal}
                transparent
                animationType="fade"
                onRequestClose={rejectSavedTable}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 24,
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            maxWidth: 400,
                            backgroundColor: baseStyle.theme.background,
                            borderRadius: 20,
                            padding: 24,
                        }}
                    >
                        <Text
                            style={[
                                baseStyle.style.headerTitleStyle,
                                {
                                    marginBottom: 12,
                                },
                            ]}
                        >
                            Voltar para a mesa?
                        </Text>

                        <Text
                            style={[
                                baseStyle.style.textStyle,
                                {
                                    marginBottom: 24,
                                },
                            ]}
                        >
                            Você estava na mesa{" "}
                            <Text style={{ fontWeight: "bold" }}>
                                {savedTable?.name}
                            </Text>
                            .
                            {"\n\n"}
                            Deseja voltar para ela?
                        </Text>

                        <ThemedButton
                            title="Voltar para a mesa"
                            onPress={resumeTable}
                        />

                        <View style={{ marginTop: 12 }}>
                            <ThemedButton
                                title="Entrar em outra mesa"
                                onPress={rejectSavedTable}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

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