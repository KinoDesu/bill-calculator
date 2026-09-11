import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { Text, TextInput, View } from "react-native";
import { SquareButton } from "./squareButton";

export type NumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function CustomNumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
}: NumberInputProps) {
  const theme = useTheme();
  const baseStyle = BaseStyle(theme);

  function decrease() {
    if (value > min) {
      onChange(value - 1);
    }
  }

  function increase() {
    if (value < max) {
      onChange(value + 1);
    }
  }

  function handleChange(text: string) {
    const number = Number(text);

    if (!isNaN(number)) {
      onChange(
        Math.min(
          Math.max(number, min),
          max
        )
      );
    }
  }

  return (
    <View style={baseStyle.numberInputContainer}>
      <Text style={baseStyle.numberInputLabel}>
        {label}
      </Text>

      <View style={baseStyle.numberInputControls}>
        <SquareButton
          title="-"
          onPress={decrease}
        />

        <TextInput
          value={String(value)}
          onChangeText={handleChange}
          keyboardType="number-pad"
          style={baseStyle.numberInput}
        />

        <SquareButton
          title="+"
          onPress={increase}
        />
      </View>
    </View>
  );
}