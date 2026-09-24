import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { showError } from "@/components/CustomToast";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import ErrorEnum from "@/constants/errorEnum";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { TableService } from "@/services/tableService";
import { TableSessionService } from "@/services/tableSessionService";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Text,
    TextInput,
    View
} from "react-native";

export default function JoinTable() {
    const baseStyle = useBaseStyle();

    const [tableCode, setTableCode] = useState("");
    const [loading, setLoading] = useState({
        status: false,
        message: "",
    });
    const [showResumeModal, setShowResumeModal] = useState(false);
    const { table, setTable } = useTable();
    const [sessionClientId, setSessionClientId] = useState("");

    useFocusEffect(
        useCallback(() => {
            checkSavedSession();

        }, [])
    );

    async function checkSavedSession() {
        try {
            setLoading({ status: true, message: "Carregando mesa" })

            const session = await TableSessionService.get();

            if (!session) {
                return;
            }

            const table = await TableService.getTableDataByCode(session.tableCode);
            setTable(table);
            setSessionClientId(session.clientId ?? "");
            setShowResumeModal(true);
        } catch (error) {
            await TableSessionService.clear();
        } finally {
            setLoading({ status: false, message: "" })
        }
    }

    function goToTable(tableCode: string) {
        if (!tableCode) {
            showError(
                ErrorEnum.ERROR.description,
                "Código da mesa não encontrado"
            );
            return;
        }

        router.push({
            pathname: "/table/[tableCode]/clients/join",
            params: {
                tableCode: tableCode,
            },
        });
    }

    function resumeTable() {
        if (!table) {
            return;
        }

        setShowResumeModal(false);

        router.push({
            pathname: "/table/[tableCode]",
            params: {
                tableCode: table.code ?? "",
            },
        });
    }

    async function rejectSavedTable() {
        await TableSessionService.clear();
        setTable(null);
        setShowResumeModal(false);
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
                                maxLength={5}
                            />

                            {loading.status ? (
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
                                        {table?.name}
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
            )}
        </>
    );
}