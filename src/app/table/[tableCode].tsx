import { Background } from "@/components/background";
import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function tableRoom() {
    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();

    return (
       <View style={baseStyle.app}>
          <Background type="home" />
          <View style={baseStyle.container}>
             <Text style={baseStyle.textStyle}>table {tableCode} screen.</Text>
          </View>
       </View>
  );
};