import { Background } from "@/components/background";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function joinTable() {
    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    return (
        <View style={baseStyle.app}>
            <Background type="joinTable" />
            <View style={baseStyle.container}>
                <QRCodeScanner
                    onRead={(data) => {
                        try {
                            const url = new URL(data);
                            const tableCode = url.pathname.split("/").pop();

                            if (!tableCode) {
                                console.error("Código da mesa não encontrado");
                                return;
                            }

                            router.push({
                                pathname: "/table/[tableCode]",
                                params: {
                                    tableCode,
                                },
                            });
                        } catch (error) {
                            console.error("Erro ao buscar mesa:", error);
                        }
                    }}
                />
                < Text style={baseStyle.textStyle} > join table screen.</Text>
            </View>
        </View >
    );
};