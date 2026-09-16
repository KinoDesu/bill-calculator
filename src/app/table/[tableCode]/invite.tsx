import { Background } from "@/components/background";
import { useBaseStyle } from "@/contexts/StyleContext";
import { QrCode } from "@/models/QrCode";
import { Table } from "@/models/Table";
import { TableService } from "@/services/tableService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function Invite() {
    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();

    const baseStyle = useBaseStyle();

    const [table, setTable] = useState<Table | null>(null);
    const [qrCode, setQrcode] = useState<QrCode>();

    const [loading, setLoading] = useState({
        status: true,
        message: "",
    });

    useEffect(() => {
        if (!tableCode) {
            return;
        }

        loadTable();
    }, [tableCode]);

    useEffect(() => {
        if (!table) {
            return;
        }

        loadQrCode();
    }, [table]);

    async function loadTable() {
        try {
            setLoading({
                status: true,
                message: "Resgatando mesa",
            });

            const table = await TableService.getTableDataByCode(tableCode)

            setTable(table);

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

    async function loadQrCode() {
        try {
            const qrCode = await TableService.getQrCode(table!.tableId!);

            setQrcode(qrCode);
        } catch (error) {
            console.error("Falha ao recuperar QR Code:", error);
        }
    }

    return (
        <>
            {loading.status ? (
                <View
                    style={[
                        baseStyle.style.app,
                        styles.loadingContainer,
                    ]}
                >
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
            ) : !table ? null : (
                <View style={baseStyle.style.app}>
                    <Background type="home" />
                    <View style={baseStyle.style.container}>
                        {qrCode && (
                            <View style={baseStyle.style.inputContainer}>
                                <View style={baseStyle.style.qrCodeContainer}>
                                    <View style={baseStyle.style.scanArea}>
                                        <Image
                                            source={{
                                                uri: `data:image/png;base64,${qrCode.qrCode}`,
                                            }}
                                            style={baseStyle.style.qrCode}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </View>
                                <View style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Text style={baseStyle.style.headerTitleStyle}>Código da sala</Text>
                                    <Text style={baseStyle.style.headerTitleStyle}>{qrCode.code}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            )}
        </>
    );

    function base64ToPng(base64: string) {
        return `data:image/png;base64,${base64}`;
    }
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});