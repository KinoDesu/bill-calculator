import { useBaseStyle } from "@/contexts/StyleContext";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SquareButton } from "./squareButton";

type QRCodeScannerProps = {
    onRead: (data: string) => void;
};

export function QRCodeScanner({ onRead }: QRCodeScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<"back" | "front">("back");

    const isFocused = useIsFocused();

    const [lastScannedData, setLastScannedData] = useState<string | null>(null);

    const baseStyle = useBaseStyle();

    useEffect(() => {
        if (isFocused) {
            setLastScannedData(null);
        }
    }, [isFocused]);

    function toggleCamera() {
        setFacing((current) =>
            current === "back" ? "front" : "back"
        );
    }

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View>
                <Pressable style={baseStyle.style.permissionContainer} onPress={requestPermission}>
                    <Text style={baseStyle.style.permissionText}>
                        Precisamos acessar sua câmera para ler o QR Code.
                    </Text>
                    <MaterialIcons name={"qr-code-scanner"} size={60} color={baseStyle.theme.primary} />
                </Pressable>
            </View>
        );
    }

    // Não mantém a câmera montada quando sai da página
    if (!isFocused) {
        return null;
    }

    function handlePlatformIcon() {
        switch (Platform.OS) {
            case "ios":
                return "flip-camera-ios"
            case "android":
                return "flip-camera-android"
            default:
                return "cameraswitch"

        }
    }

    return (
        <View style={baseStyle.style.qrCodeContainer}>
            <View style={baseStyle.style.scanArea}>
                <CameraView
                    style={baseStyle.style.camera}
                    facing={facing}
                    ratio="1:1"
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    onBarcodeScanned={({ data }) => {
                        if (data === lastScannedData) {
                            return;
                        }

                        setLastScannedData(data);

                        onRead(data);
                    }}
                />
            </View>

            {Platform.OS !== "web" && (
                <SquareButton
                    title="C"
                    icon={handlePlatformIcon()}
                    onPress={toggleCamera}
                />
            )}
        </View>
    );
}
