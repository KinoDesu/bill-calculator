import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { useBaseStyle } from "@/contexts/StyleContext";
import { Text, View } from "react-native";

export default function Index() {

  const baseStyle = useBaseStyle();

  return (
    <View style={baseStyle.style.app}>
      <Background type="home" />
      <View style={baseStyle.style.container}>
        <Text style={baseStyle.style.appTitleStyle}>Calcula Conta</Text>
        <View style={baseStyle.style.buttonContainer}>
          <ThemedButton
            title="Criar uma mesa"
            href="/table/create"
          />
          <ThemedButton
            title="Entrar em uma mesa"
            href="/table/join"
          />
        </View>
      </View>
    </View>
  );
}
