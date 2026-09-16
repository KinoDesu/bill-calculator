import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { CustomNumberInput } from "@/components/customNumberInput";
import { environment } from "@/config/environment";
import { useSession } from "@/contexts/SessionContext";
import { useTheme } from "@/hooks/use-theme";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { Table } from "@/models/Table";
import { TableRegisterRequest } from "@/models/TableRegisterRequest";
import { ClientService } from "@/services/clientService";
import { TableService } from "@/services/tableService";
import { BaseStyle } from "@/styles/baseStyle";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

export default function createTable() {
   const theme = useTheme();

  if (!theme.isReady) {
    return null; // não renderiza nada até saber o tema de verdade
  }

  const baseStyle = BaseStyle(theme);

   const { saveSession } = useSession();

   const [clientQuantity, setClientQuantity] = useState(2);
   const [tableName, setTableName] = useState("");
   const [clientName, setClientName] = useState("");
   const [table, setTable] = useState<Table | null>(null);
   const [loading, setLoading] = useState(false);

   async function handleCreateTable() {
      if (!clientName.trim()) {
         console.error("Nome do cliente não informado");
         return;
      }

      if (!tableName.trim()) {
         console.error("Nome da mesa não informado");
         return;
      }

      try {
         setLoading(true);

         const tableRequest: TableRegisterRequest = {
            tableName: tableName.trim(),
            clientQuantity: clientQuantity,
            redirectUrl: environment.appDeepLink,
         };

         const createdTable = await TableService.registerTable(
            tableRequest
         );

         setTable(createdTable);

         const clientRequest: ClientRegisterRequest = {
            name: clientName.trim(),
            clientId: null,
         };

         await ClientService.registerClient(
            clientRequest,
            createdTable.tableId!
         );

         await saveSession({
            tableId: createdTable.tableId!,
            tableCode: createdTable.code!,
         });

         router.replace({
            pathname: "/table/[tableCode]/clients/create",
            params: {
               tableCode: createdTable.code!,
            },
         });
      } catch (error) {
         console.error("Falha ao criar mesa:", error);
      } finally {
         setLoading(false);
      }
   }

   return (
      <View style={baseStyle.app}>
         <Background type="createTable" />

         <View style={baseStyle.container}>
            <View style={baseStyle.inputContainer}>
               <TextInput
                  style={baseStyle.inputStyle}
                  placeholder="Seu nome"
                  placeholderTextColor={theme.inputPlaceHolder}
                  onChangeText={setClientName}
               />

               <TextInput
                  style={baseStyle.inputStyle}
                  placeholder="Nome da mesa"
                  placeholderTextColor={theme.inputPlaceHolder}
                  onChangeText={setTableName}
               />

               <CustomNumberInput
                  label="Pessoas na mesa"
                  value={clientQuantity}
                  onChange={setClientQuantity}
                  min={2}
                  max={20}
               />

               {loading ? (
                  <View>
                     <ActivityIndicator
                        size="large"
                        color={theme.primary}
                     />

                     <Text
                        style={[
                           baseStyle.textStyle,
                           {
                              marginTop: 16,
                           },
                        ]}
                     >
                        Criando mesa...
                     </Text>
                  </View>
               ) : null}

               <View style={baseStyle.buttonContainer} />
            </View>

            <ThemedButton
               title="Registrar clientes"
               onPress={handleCreateTable}
            />
         </View>
      </View>
   );
}