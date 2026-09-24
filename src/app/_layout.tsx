import { SessionProvider } from "@/contexts/SessionContext";
import { StyleProvider } from "@/contexts/StyleContext";
import { TableProvider } from "@/contexts/TableContext";
import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {

  const theme = useTheme();

  if (!theme.isReady) {
    return null;
  }

  const baseStyle = BaseStyle.style(theme);

  return (
    <StyleProvider value={{ theme, style: baseStyle }}>
      <SessionProvider>
        <TableProvider>
          <Stack screenOptions={{
            headerShown: true,
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
            <Stack.Screen name="table/[tableCode]/index" options={{ title: "" }} />
            <Stack.Screen name="table/[tableCode]/clients/create" options={{ title: "Registrar clientes" }} />
            <Stack.Screen name="table/[tableCode]/clients/join" options={{ title: "Se apresente" }} />
            <Stack.Screen name="table/[tableCode]/order/create" options={{ title: "Fazer pedido" }} />
            <Stack.Screen name="table/[tableCode]/order/edit" options={{ title: "Editar pedido" }} />
            <Stack.Screen name="table/[tableCode]/invite" options={{ title: "Convide seus amigos" }} />
            <Stack.Screen name="table/[tableCode]/billing" options={{ title: "Conta" }} />
          </Stack>
        </TableProvider>
      </SessionProvider>
    </StyleProvider>
  );
}
