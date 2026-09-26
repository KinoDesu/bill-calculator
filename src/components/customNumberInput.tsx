import { useBaseStyle } from "@/contexts/StyleContext";
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

  const baseStyle = useBaseStyle();

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
    <View style={baseStyle.style.numberInputContainer}>
      <Text style={baseStyle.style.numberInputLabel}>
        {label}
      </Text>

      <View style={baseStyle.style.numberInputControls}>
        <SquareButton
          title="-"
          icon="remove"
          iconSize={24}
          onPress={decrease}
        />

        <TextInput
          value={String(value)}
          onChangeText={handleChange}
          keyboardType="number-pad"
          style={baseStyle.style.numberInput}
          maxLength={2}
        />

        <SquareButton
          title="+"
          icon="add"
          iconSize={24}
          onPress={increase}
        />
      </View>
    </View>
  );
}