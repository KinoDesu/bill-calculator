import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { Text, View } from "react-native";

export default function AboutScreen() {
    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    return (
        <View style={baseStyle.container}>
            <Text style={baseStyle.textStyle}>About screen.</Text>
        </View>
    );
};
