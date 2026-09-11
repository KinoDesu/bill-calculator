import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "expo-router";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";

type QRCodeScannerProps = {
    onRead: (data: string) => void;
};

export function QRCodeScanner({ onRead }: QRCodeScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();

    const isFocused = useIsFocused();

    const lastScannedData = useRef<string | null>(null);

    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    useEffect(() => {
        if (isFocused) {
            lastScannedData.current = null;
        }
    }, [isFocused]);

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

    // Não mantém a câmera montada quando sai da página
    if (!isFocused) {
        return null;
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