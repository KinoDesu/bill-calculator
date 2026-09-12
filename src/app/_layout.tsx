import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { Stack } from "expo-router";
import { Platform, useColorScheme } from "react-native";

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const theme = useTheme();
  const baseStyle = BaseStyle(theme);
  
  return (
<Stack screenOptions={{headerShown: true,
    headerStyle: baseStyle.headerStyle,
    headerTintColor: baseStyle.headerTintColor.tintColor,
    headerTitleStyle: baseStyle.headerTitleStyle,
    headerTitleAlign: baseStyle.headerTitleAlign.textAlign,
    headerLeft:
         Platform.OS === "web"
            ? () => null
            : undefined,
    }}>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="table/create" options={{ title: "Criar uma mesa" }} />
      <Stack.Screen name="table/join" options={{ title: "Sentar-se à mesa" }} />
      <Stack.Screen name="table/[tableCode]" options={{ title: "[tableCode]" }} />
    </Stack>
  );
}
