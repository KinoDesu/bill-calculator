import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const theme = useTheme();
  const baseStyle = BaseStyle(theme);
  console.log(colorScheme);
  console.log(theme);
  
  return (
<Stack screenOptions={{headerShown: true,
    headerStyle: baseStyle.headerStyle,
    headerTintColor: baseStyle.headerTintColor.tintColor,
    headerTitleStyle: baseStyle.headerTitleStyle,
    headerTitleAlign: baseStyle.headerTitleAlign.textAlign,
    }}>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="table/create" options={{ title: "Create Table" }} />
      <Stack.Screen name="table/join" options={{ title: "Join Table" }} />
      <Stack.Screen name="table/[tableCode]" options={{ title: "Table Room" }} />
    </Stack>
  );
}
