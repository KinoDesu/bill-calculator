import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { CustomNumberInput } from "@/components/customNumberInput";
import { environment } from "@/config/environment";
import { useSession } from "@/contexts/SessionContext";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { TableRegisterRequest } from "@/models/TableRegisterRequest";
import { ClientService } from "@/services/clientService";
import { TableService } from "@/services/tableService";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

export default function createTable() {
   const baseStyle = useBaseStyle();

   const { saveSession } = useSession();

   const [clientQuantity, setClientQuantity] = useState(2);
   const [tableName, setTableName] = useState("");
   const [clientName, setClientName] = useState("");
   const { table, setTable } = useTable();
   const [loading, setLoading] = useState({
      status: false,
      message: "",
   });

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
         setLoading({
            status: true,
            message: "Criando mesa"
         });

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
         setLoading({
            status: false,
            message: ""
         });
      }
   }

   return (
      <>
         {loading.status ? (

            <View
               style={[
                  baseStyle.style.app,
                  baseStyle.style.loadingContainer,
               ]}
            >
               <ActivityIndicator
                  size="large"
                  color={baseStyle.theme.primary}
               />

               <Text style={baseStyle.style.textStyle}>
                  {loading.message}
               </Text>
            </View>
         ) : (
            <View style={baseStyle.style.app}>
               <Background type="createTable" />

               <View style={baseStyle.style.container}>
                  <View style={baseStyle.style.inputContainer}>
                     <TextInput
                        style={baseStyle.style.inputStyle}
                        placeholder="Seu nome"
                        placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                        onChangeText={setClientName}
                     />

                     <TextInput
                        style={baseStyle.style.inputStyle}
                        placeholder="Nome da mesa"
                        placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                        onChangeText={setTableName}
                     />

                     <CustomNumberInput
                        label="Pessoas na mesa"
                        value={clientQuantity}
                        onChange={setClientQuantity}
                        min={2}
                        max={20}
                     />

                     <View style={baseStyle.style.buttonContainer} />
                  </View>

                  <ThemedButton
                     title="Registrar clientes"
                     onPress={handleCreateTable}
                  />
               </View>
            </View>
         )}

      </>
   );
}