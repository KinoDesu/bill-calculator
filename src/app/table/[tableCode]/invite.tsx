import { Background } from "@/components/background";
import { SquareButton } from "@/components/squareButton";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { QrCode } from "@/models/QrCode";
import { TableService } from "@/services/tableService";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Invite() {
    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();

    const baseStyle = useBaseStyle();

    const { table, setTable } = useTable();
    const [qrCode, setQrcode] = useState<QrCode>();

    const [loading, setLoading] = useState({
        status: false,
        message: "",
    });

    useEffect(() => {
        loadTable();
        loadQrCode();
    }, [tableCode]);

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
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
                                        <Text style={baseStyle.style.headerTitleStyle}>{qrCode.code}</Text>
                                        <SquareButton
                                            style={{ maxHeight: 30, maxWidth: 30 }}
                                            title="C"
                                            icon="content-copy"
                                            iconSize={24}
                                            onPress={async () => {
                                                await Clipboard.setStringAsync(qrCode.code);
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>

                        )}
                    </View>
                </View>
            )}
        </>
    );
};