import { useBaseStyle } from "@/contexts/StyleContext";
import { router, type Href } from "expo-router";
import { Pressable, Text, type PressableProps } from "react-native";

export type ButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  href?: Href;
};

export function SquareButton({
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
  
  const baseStyle = useBaseStyle();

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
      style={({ pressed }) => [
        baseStyle.style.squareButtonStyle,
        pressed && baseStyle.style.buttonPressed,
      ]}
    >
      <Text style={baseStyle.style.buttonText}>
        {title}
      </Text>
    </Pressable>
  );
}