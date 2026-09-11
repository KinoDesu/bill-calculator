import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { Pressable, Text, View } from "react-native";

type QRCodeScannerProps = {
    onRead: (data: string) => void;
};

export function QRCodeScanner({ onRead }: QRCodeScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();

    const lastScannedData = useRef<string | null>(null);

    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    useFocusEffect(
        useCallback(() => {
            // Reseta o último QR Code sempre que a tela entrar em foco
            lastScannedData.current = null;
        }, [])
    );

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View style={baseStyle.permissionContainer}>
                <Text style={baseStyle.permissionText}>
                    Precisamos acessar sua câmera para ler o QR Code.
                </Text>

                <Pressable onPress={requestPermission}>
                    <Text style={baseStyle.permissionButton}>
                        Permitir acesso à câmera
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={baseStyle.scanArea}>
            <CameraView
                style={baseStyle.camera}
                facing="back"
                ratio="1:1"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={({ data }) => {
                    if (data === lastScannedData.current) {
                        return;
                    }

                    lastScannedData.current = data;

                    onRead(data);
                }}
            />
        </View>
    );
}