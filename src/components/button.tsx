import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { router, type Href } from "expo-router";
import { Pressable, Text, type PressableProps } from "react-native";

export type ButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  href?: Href;
};

export function ThemedButton({
  title,
  href,
  onPress,
  ...rest
}: ButtonProps) {
  const handlePress = (event: any) => {
    onPress?.(event);

    if (href) {
      router.push(href);
    }
  };

  const theme = useTheme();
  const baseStyle = BaseStyle(theme);

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
      style={({ pressed }) => [
        baseStyle.buttonStyle,
        pressed && baseStyle.buttonPressed,
      ]}
    >
      <Text style={baseStyle.buttonText}>
        {title}
      </Text>
    </Pressable>
  );
}