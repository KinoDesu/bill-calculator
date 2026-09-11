import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { Text, View } from "react-native";

export default function Index() {

  const theme = useTheme();
  const baseStyle = BaseStyle(theme);
  return (
    <View style={baseStyle.app}>
      <Background type="home" />
      <View style={baseStyle.container}>
        <Text style={baseStyle.titleStyle}>Calcula Conta</Text>
        <View style={baseStyle.buttonContainer}>
          <ThemedButton
            title="Criar uma mesa"
            onPress={() => console.log('Criar mesa')}
          />
          <ThemedButton
            title="Entrar em uma mesa"
            onPress={() => console.log('Entrar em mesa')}
          />
        </View>
      </View>
    </View>
  );
}
