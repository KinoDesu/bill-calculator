import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { CustomNumberInput } from "@/components/customNumberInput";
import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import { useState } from "react";
import { TextInput, View } from "react-native";

export default function createTable() {
   const theme = useTheme();
   const baseStyle = BaseStyle(theme);

   const [people, setPeople] = useState(2);

   return (
      <View style={baseStyle.app}>
         <Background type="createTable" />
         <View style={baseStyle.container}>
            <View style={baseStyle.inputContainer}>
               <TextInput style={baseStyle.inputStyle} placeholder="Seu nome" placeholderTextColor={theme.inputPlaceHolder} />
               <TextInput style={baseStyle.inputStyle} placeholder="Nome da mesa" placeholderTextColor={theme.inputPlaceHolder} />
               <CustomNumberInput
                  label="Pessoas na mesa"
                  value={people}
                  onChange={setPeople}
                  min={2}
                  max={20}
               />
               <View style={baseStyle.buttonContainer}>
               </View>
            </View>
            <ThemedButton
               title="Registrar clientes"
               onPress={() => console.log('Registrar clientes')}
            //  href="/table/create"
            />
         </View>
      </View>
   );
};