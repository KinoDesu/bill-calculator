import { Background } from "@/components/background";
import { useTheme } from "@/hooks/use-theme";
import { QrCode } from "@/models/QrCode";
import { Table } from "@/models/Table";
import { TableService } from "@/services/tableService";
import { BaseStyle } from "@/styles/baseStyle";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function Invite() {
    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();

    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

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
                        baseStyle.app,
                        styles.loadingContainer,
                    ]}
                >
                    <ActivityIndicator
                        size="large"
                        color={theme.primary}
                    />

                    <Text
                        style={[
                            baseStyle.textStyle,
                            {
                                marginTop: 16,
                            },
                        ]}
                    >
                        {loading.message}
                    </Text>
                </View>
            ) : !table ? null : (
                <View style={baseStyle.app}>
                    <Background type="home" />
                    <View style={baseStyle.container}>
                        {qrCode && (
                            <View style={baseStyle.inputContainer}>
                                <View style={baseStyle.qrCodeContainer}>
                                    <View style={baseStyle.scanArea}>
                                        <Image
                                            source={{
                                                uri: `data:image/png;base64,${qrCode.qrCode}`,
                                            }}
                                            style={baseStyle.qrCode}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </View>
                                <View style={{
                                    display:"flex",
                                    flexDirection:"column",
                                    justifyContent:"center",
                                    alignItems:"center"
                                }}>
                                    <Text style={baseStyle.headerTitleStyle}>Código da sala</Text>
                                    <Text style={baseStyle.headerTitleStyle}>{qrCode.code}</Text>
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