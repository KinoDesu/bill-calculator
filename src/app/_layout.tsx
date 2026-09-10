import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const theme = useTheme();
  console.log(colorScheme);
  console.log(theme);
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
    </Stack>
  );
}
