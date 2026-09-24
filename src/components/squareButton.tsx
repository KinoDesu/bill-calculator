import { useBaseStyle } from "@/contexts/StyleContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable, StyleProp, Text, ViewStyle, type PressableProps } from "react-native";

export type ButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  href?: Href;
};

export function SquareButton({
  title,
  icon,
  iconSize,
  href,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const handlePress = (event: any) => {
    onPress?.(event);

    if (href) {
      router.push(href);
    }
  };

  const baseStyle = useBaseStyle();

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
      style={({ pressed }) => [
        baseStyle.style.squareButtonStyle,
        style,
        pressed && baseStyle.style.buttonPressed,
      ]}
    >
      {
        icon ? (
          <MaterialIcons name={icon} size={iconSize ? iconSize : 36} color={baseStyle.theme.primary} />
        ) : (
          <Text style={baseStyle.style.buttonText}>
            {title}
          </Text>
        )
      }
    </Pressable>
  );
}